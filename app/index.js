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
import { vibration } from "haptics"


import * as util from "../common/utils";
//import * as schedule from "schedule.js";
import * as schedUtils from "scheduleUtils.js";



//---Shedule Test Work Here---
var sched = "Regular";
/*
let t = "2:10"
console.log("Is in Schedule: " + schedUtils.isInSchedule(sched,t));
console.log("Period: " + schedUtils.getCurrentPeriod (sched,t));
console.log("Time Left: " +schedUtils.getTimeLeftInPeriod(sched,t));


let periods = schedUtils.getPeriodList(sched);
console.log(periods.length);
for (let i = 0; i< periods.length; i++){
  console.log(periods[i].name);
}
*/

// Update the clock every minute
clock.granularity = "minutes";

let background = document.getElementById("clickbg");

// Views
let clockView = document.getElementById("clock");
let statsView = document.getElementById("stats");

// Get a handle on the <text> element
// Clock view
let clockLabel = document.getElementById("clockLabel");
let dateLabel = document.getElementById("dateLabel");
let hrLabel = document.getElementById("hrLabel");
let stepsLabel = document.getElementById("stepsLabel");
let periodLabel = document.getElementById("periodLabel");
let timeRemainingLabel = document.getElementById("timeRemainingLabel");

// Stats View
let stepStatsLabel = document.getElementById("stepStatsLabel");
let distStatsLabel = document.getElementById("distStatsLabel");
let floorsStatsLabel = document.getElementById("floorsStatsLabel");
let activeStatsLabel = document.getElementById("activeStatsLabel");
let calsStatsLabel = document.getElementById("calsStatsLabel");

// Schedule view
let period1StartLabel = document.getElementById("period1StartLabel");
let period1NameLabel = document.getElementById("period1NameLabel");
let period1EndLabel = document.getElementById("period1EndLabel");
let period2StartLabel = document.getElementById("period2StartLabel");
let period2NameLabel = document.getElementById("period2NameLabel");
let period2EndLabel = document.getElementById("period2EndLabel");
let period3StartLabel = document.getElementById("period3StartLabel");
let period3NameLabel = document.getElementById("period3NameLabel");
let period3EndLabel = document.getElementById("period3EndLabel");
let period4StartLabel = document.getElementById("period4StartLabel");
let period4NameLabel = document.getElementById("period4NameLabel");
let period4EndLabel = document.getElementById("period4EndLabel");
let period51StartLabel = document.getElementById("period51StartLabel");
let period51NameLabel = document.getElementById("period51NameLabel");
let period51EndLabel = document.getElementById("period51EndLabel");
let period52StartLabel = document.getElementById("period52StartLabel");
let period52NameLabel = document.getElementById("period52NameLabel");
let period52EndLabel = document.getElementById("period52EndLabel");
let period53StartLabel = document.getElementById("period53StartLabel");
let period53NameLabel = document.getElementById("period53NameLabel");
let period53EndLabel = document.getElementById("period53EndLabel");
let period6StartLabel = document.getElementById("period6StartLabel");
let period6NameLabel = document.getElementById("period6NameLabel");
let period6EndLabel = document.getElementById("period6EndLabel");
let period7StartLabel = document.getElementById("period7StartLabel");
let period7NameLabel = document.getElementById("period7NameLabel");
let period7EndLabel = document.getElementById("period7EndLabel");
let period8StartLabel = document.getElementById("period8StartLabel");
let period8NameLabel = document.getElementById("period8NameLabel");
let period8EndLabel = document.getElementById("period8EndLabel");

let didVib = false;

// Heart Rate Monitor
let hrm = new HeartRateSensor();

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
    if (hours > 12){
      ampm = " pm";
      hours -= 12;
    } else if (hours == 12){
      ampm = " pm"
    }else if (hours == 0 && ampm == " am"){
      hours += 12;
    }
  } else {
    ampm = ""
  }

  dateLabel.text = `${util.toDay(day)}, ${util.toMonth(month)} ${date}`;
  clockLabel.text = `${hours}:${mins}${ampm}`;
  if (showClock && display.on){
    updatePeriodData();
  }
}

function updateClockData() {
  if (showClock && display.on){
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
}

function updatePeriodData() {
  let today = new Date();
  let time = schedUtils.hourAndMinToTime(today.getHours(), today.getMinutes())
  //let time = "11:08a";
  let remaining = schedUtils.getTimeLeftInPeriod(sched, time);
  //console.log(time);

  if (schedUtils.isInSchedule(sched, time)){
      periodLabel.text = `${schedUtils.getCurrentPeriod(sched, time)}`;
      if (remaining <= 2){
        timeRemainingLabel.style.fill = 'fb-red';
        if (!didVib){
          vibration.start("nudge-max");
          didVib = true;
        }
      } else if (remaining > 2 && didVib){
        didVib = false;
        timeRemainingLabel.style.fill = 'silver';
      } else {
        timeRemainingLabel.style.fill = 'silver';
      }
      timeRemainingLabel.text = `Remaining: ${remaining} min`;
  } else {
    periodLabel.text = ``;
    timeRemainingLabel.text = ``;
  }
}

function updateStatsData(){
  if (!showClock && display.on){
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
    hrm.start();
    showClock = true;
    updateClock();
    updateClockData();
    clockView.style.display = "inline";
    statsView.style.display = "none";
  } else {
    hrm.stop();
  }
}


// Update the clock every tick event
clock.ontick = () => updateClock();
setInterval(updateClockData, 3000);
setInterval(updateStatsData, 3000);

// Don't start with a blank screen
updateClock();
updateClockData();
hrm.start();