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

// Update the clock every minute
clock.granularity = "minutes";

let background = document.getElementById("clickbg");

// Views
let clockView = document.getElementById("clock");
let statsView = document.getElementById("stats");
let scheduleView = document.getElementById("schedule");

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
let periodLabels = [
  {start: document.getElementById("period0StartLabel"), 
    name: document.getElementById("period0NameLabel"), 
    end: document.getElementById("period0EndLabel")},
  {start: document.getElementById("period1StartLabel"), 
    name: document.getElementById("period1NameLabel"), 
    end: document.getElementById("period1EndLabel")},
  {start: document.getElementById("period2StartLabel"), 
    name: document.getElementById("period2NameLabel"), 
    end: document.getElementById("period2EndLabel")},
  {start: document.getElementById("period3StartLabel"), 
    name: document.getElementById("period3NameLabel"), 
    end: document.getElementById("period3EndLabel")},
  {start: document.getElementById("period4StartLabel"), 
    name: document.getElementById("period4NameLabel"), 
    end: document.getElementById("period4EndLabel")},
  {start: document.getElementById("period5StartLabel"), 
    name: document.getElementById("period5NameLabel"), 
    end: document.getElementById("period5EndLabel")},
  {start: document.getElementById("period6StartLabel"), 
    name: document.getElementById("period6NameLabel"), 
    end: document.getElementById("period6EndLabel")},
  {start: document.getElementById("period7StartLabel"), 
    name: document.getElementById("period7NameLabel"), 
    end: document.getElementById("period7EndLabel")},
  {start: document.getElementById("period8StartLabel"), 
    name: document.getElementById("period8NameLabel"), 
    end: document.getElementById("period8EndLabel")},
  {start: document.getElementById("period9StartLabel"), 
    name: document.getElementById("period9NameLabel"), 
    end: document.getElementById("period9EndLabel")}
  ]

/*
let periods = schedUtils.getPeriodList(sched);
console.log(periodLabels.length);
for (let i = 0; i< periods.length; i++){
  console.log(periods[i].start + " " + periods[i].name + " " + periods[i].end);
  console.log(periodLabels[i].start.y + " " + periodLabels[i].name.y + " " + periodLabels[i].end.y);
}
*/
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
  updatePeriodData();
}

function updateClockData() {
  if (show == "clock" && display.on){
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
  if (show == "stats" && display.on){
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
  
function updateScheduleData(){
  if (show == "schedule" && display.on){
    let today = new Date();
    let time = schedUtils.hourAndMinToTime(today.getHours(), today.getMinutes());
    let per = schedUtils.getCurrentPeriod(sched, time);
    let periods = schedUtils.getPeriodList(sched);
    
    for (let i = 0; i < periods.length; i++){
      if (periods[i].name == per){
        periodLabels[i].start.style.fontFamily = 'Colfax-Medium';
        periodLabels[i].start.style.fill = 'fb-cyan';
        periodLabels[i].name.style.fontFamily = 'Colfax-Medium';
        periodLabels[i].name.style.fill = 'fb-cyan';
        periodLabels[i].end.style.fontFamily = 'Colfax-Medium';
        periodLabels[i].end.style.fill = 'fb-cyan';
      } else {
        periodLabels[i].start.style.fontFamily = 'Colfax-Regular';
        periodLabels[i].start.style.fill = 'white';
        periodLabels[i].name.style.fontFamily = 'Colfax-Regular';
        periodLabels[i].name.style.fill = 'white';
        periodLabels[i].end.style.fontFamily = 'Colfax-Regular';
        periodLabels[i].end.style.fill = 'white';
      }
      periodLabels[i].start.text = `${periods[i].start}`;
      periodLabels[i].name.text = `${periods[i].name}`;
      periodLabels[i].end.text = `${periods[i].end}`;
    }
  }
}

// Handle Click
let show = "clock";
background.onclick = function(evt) {
  //console.log("Click");
  if (show == "clock"){           // In Clock -> Switching to Stats
    show = "stats";
    updateStatsData()
    clockView.style.display = "none";
    statsView.style.display = "inline";
    scheduleView.style.display = "none";
    display.poke()
  } else if (show == "stats"){                   // In Stats -> Switching to Clock or schedule
    let today = new Date();
    let time = schedUtils.hourAndMinToTime(today.getHours(), today.getMinutes())
    
    if (schedUtils.isInSchedule(sched, time)){  
      show = "schedule";
      updateScheduleData();
      clockView.style.display = "none";
      statsView.style.display = "none";
      scheduleView.style.display = "inline";
    } else {
      show = "clock";
      updateClock();
      updateClockData();
      clockView.style.display = "inline";
      statsView.style.display = "none";
      scheduleView.style.display = "none";
    } 
  } else {                                  // In Schedule -> Switching to Clock
    show = "clock";
    updateClock();
    updateClockData();
    clockView.style.display = "inline";
    statsView.style.display = "none";
    scheduleView.style.display = "none";
  }
  //console.log("ShowClock is " + showClock);
}

display.onchange = function() {
  if (!display.on) {
    hrm.start();
    show = "clock";
    updateClock();
    updateClockData();
    clockView.style.display = "inline";
    statsView.style.display = "none";
    scheduleView.style.display = "none";
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
