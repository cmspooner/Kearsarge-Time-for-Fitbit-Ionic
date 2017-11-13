console.log("Kearsarge Time Started");

/*
 * Entry point for the watch app
 */
import clock from "clock";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";
import { goals } from "user-activity";
import { user } from "user-profile";
import { display } from "display";
import { preferences } from "user-settings";


import * as util from "../common/utils";
//import * as schedule from "schedule.js";
import * as schedUtils from "scheduleUtils.js";



//---Shedule Test Work Here---
let sched = "Regular";
let t = "9:01a"
console.log("Is in Schedule: " + schedUtils.isInSchedule(sched,t));
console.log("Period: " + schedUtils.getCurrentPeriod (sched,t));
console.log("Time Left: " +schedUtils.getTimeLeftInPeriod(sched,t));

// Update the clock every minute
clock.granularity = "minutes";

let background = document.getElementById("clickbg");

// Views
let clockView = document.getElementById("clock");
let statsView = document.getElementById("stats");

// Get a handle on the <text> element
// Clockview
let clockLabel = document.getElementById("clockLabel");
let dateLabel = document.getElementById("dateLabel");
let hrLabel = document.getElementById("hrLabel");
let stepsLabel = document.getElementById("stepsLabel");

// Stats View
let stepStatsLabel = document.getElementById("stepStatsLabel");
let distStatsLabel = document.getElementById("distStatsLabel");
let floorsStatsLabel = document.getElementById("floorsStatsLabel");
let activeStatsLabel = document.getElementById("activeStatsLabel");
let calsStatsLabel = document.getElementById("calsStatsLabel");

// Heart Rate Monitor
let hrm = new HeartRateSensor();
hrm.start();

// Update the <text> element with the current time
function updateClock() {
  let today = new Date();
  let date = today.getDate();
  let day = today.getDay();
  let month = today.getMonth();
  let year = today.getYear()-100+2000;
  let hours = today.getHours();
  let mins = util.zeroPad(today.getMinutes());
  let ampm = " am"
  
  //console.log(preferences.clockDisplay);
  if (preferences.clockDisplay == "12h"){
    if (hours> 12){
      ampm = " pm";
      hours -= 12;
    } else if (hours == 0 && ampm == " am"){
      hours += 12;
    }
  } else {
    ampm = ""
  }

  dateLabel.text = `${util.toDay(day)}, ${util.toMonth(month)} ${date}`;
  clockLabel.text = `${hours}:${mins}${ampm}`;
}

function updateClockData() {
  let data = {
    heart: {
      theHeartRate: hrm.heartRate ? hrm.heartRate : 0
    },
    step: {
      steps: today.local.steps ? today.local.steps: 0
    }
  };
  
  //console.log("Data:");
  //console.log(data.heart.theHeartRate);
  //console.log(data.step.steps.toLocaleString());
  
  hrLabel.style.fill = 'white';
  stepsLabel.style.fill = 'white';
  
  if (data.heart.theHeartRate == 0) {
      hrLabel.text = `--`;
  } else {
      if (user.heartRateZone(data.heart.theHeartRate) == "out-of-range"){
        hrLabel.style.fill = 'fb-cyan';  // #14D3F5
      } else if (user.heartRateZone(data.heart.theHeartRate) == "fat-burn"){
        hrLabel.style.fill = 'fb-mint'; // #5BE37D
      } else if (user.heartRateZone(data.heart.theHeartRate) == "cardio"){
        hrLabel.style.fill = 'fb-peach'; // #FFCC33
      } else if (user.heartRateZone(data.heart.theHeartRate) == "peak"){
        hrLabel.style.fill = 'fb-red'; // #F83C40
      }
      hrLabel.text = `${data.heart.theHeartRate} bpm`;
  }
  
  stepsLabel.style.fill = util.goalToColor(data.step.steps, goals.steps);
  stepsLabel.text = `${data.step.steps.toLocaleString()} steps`;
  
}

function updateStatsData(){
  stepStatsLabel.style.fill = util.goalToColor(today.local.steps, goals.steps);
  stepStatsLabel.text = `Steps: ${today.local.steps ? today.local.steps.toLocaleString() : 0} / ${goals.steps.toLocaleString()}`;
  
  // Multiply by .000621371 to convert from meters to miles
  distStatsLabel.style.fill = util.goalToColor(today.local.distance, goals.distance);
  distStatsLabel.text = `Distance: ${today.local.distance ? util.round2(today.local.distance * 0.000621371) : 0 } / ${util.round2(goals.distance*0.000621371)}`;
  
  // Divide by 10 due to weird error
  floorsStatsLabel.style.fill = util.goalToColor(today.local.elevationGain, goals.elevationGain/10);
  floorsStatsLabel.text = `Floors: ${today.local.elevationGain ? today.local.elevationGain : 0} / ${goals.elevationGain/10}`;
  
  activeStatsLabel.style.fill = util.goalToColor(today.local.activeMinutes, goals.activeMinutes);
  activeStatsLabel.text = `Active: ${today.local.activeMinutes ? today.local.activeMinutes.toLocaleString() : 0} / ${goals.activeMinutes}`;
  
  // Divide by 6.8 due to weird error
  calsStatsLabel.style.fill = util.goalToColor(today.local.calories, goals.calories/6.8);
  calsStatsLabel.text = `Calories: ${today.local.calories ? today.local.calories.toLocaleString() : 0} / ${parseInt(goals.calories/6.8).toLocaleString()}`;
}

// Handle Click
let showClock = true;
background.onclick = function(evt) {
  //console.log("Click");
  if (showClock){           // In Clock -> Switching to Stats
    showClock = false;
    updateStatsData()
    clockView.style.display = "none";
    statsView.style.display = "inline";
    display.poke()
  } else{                   // In Stats -> Switching to Clock
    showClock = true;
    updateClock();
    updateClockData();
    clockView.style.display = "inline";
    statsView.style.display = "none"; 
  }
  //console.log("ShowClock is " + showClock);
}

display.onchange = function() {
  if (!display.on) {
    showClock = true;
    updateClock();
    updateClockData();
    clockView.style.display = "inline";
    statsView.style.display = "none"; 
  }
}


// Update the clock every tick event
clock.ontick = () => updateClock();
setInterval(updateClockData, 3000);
setInterval(updateStatsData, 3000);

// Don't start with a blank screen
updateClock();
updateClockData();

