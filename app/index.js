console.log("Kearsarge Time Started");

/*
 * Entry point for the watch app
 */
import clock from "clock";
import document from "document";

import * as messaging from "messaging";

import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";
import { goals } from "user-activity";
import { user } from "user-profile";
import { display } from "display";
import { preferences } from "user-settings";
import { vibration } from "haptics"

import * as util from "../common/utils";
import * as schedUtils from "scheduleUtils.js";

var sched = "Regular";

var sepratorGoal = true;
var color = "deepskyblue";
var updateInterval = 30;
var showDataAge = false;

var fakeTime = false;

// Update the clock every minute
clock.granularity = "minutes";

let background = document.getElementById("clickbg");

// Views
let clockView = document.getElementById("clock");
let periodView = document.getElementById("period");
let weatherView = document.getElementById("weather");
let statsView = document.getElementById("stats");
let scheduleView = document.getElementById("schedule");

// Get a handle on the <text> element
// Clock view
let clockLabel = document.getElementById("clockLabel");
let seperatorLineRight = document.getElementById("seperatorLineRight");
let seperatorLineLeft = document.getElementById("seperatorLineLeft");
let dateLabel = document.getElementById("dateLabel");
let hrLabel = document.getElementById("hrLabel");
let stepsLabel = document.getElementById("stepsLabel");

// Period View
let periodLabel = document.getElementById("periodLabel");
let timeRemainingLabel = document.getElementById("timeRemainingLabel");

// Weather View
let tempAndConditionLabel = document.getElementById("tempAndConditionLabel");
let weatherLocationLabel = document.getElementById("weatherLocationLabel");
let weatherImage = document.getElementById("weatherImage");

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

let didVib = false;
let show = "clock";

// Heart Rate Monitor
let hrm = new HeartRateSensor();

//----------------------------Messaging and Settings--------------
// Message is received
      
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === "updateInterval" && evt.data.newValue) {
    updateInterval = JSON.parse(evt.data.newValue).values[0].name
    console.log(`updateInterval is: ${updateInterval}`);
    if (updateInterval == "15 minutes")
      updateInterval = 15;
    else if (updateInterval == "30 minutes")
      updateInterval = 30;
    else if (updateInterval == "1 hour")
      updateInterval = 60;
    else if (updateInterval == "2 hours")
      updateInterval = 120;
    console.log(`updateInterval is: ${updateInterval}`);
    weather.fetch();
  }
  if (evt.data.key === "color" && evt.data.newValue) {
    color = JSON.parse(evt.data.newValue);
    console.log(`Setting Seperator Bar color: ${color}`);
    seperatorLineRight.style.fill = color;
    seperatorLineLeft.style.fill = color;
  }
  if (evt.data.key === "schedule" && evt.data.newValue) {
    sched = JSON.parse(evt.data.newValue).values[0].name;
    console.log(`Schedule is: ${sched}`);
  }
  if (evt.data.key === "seperatorToggle" && evt.data.newValue) {
    sepratorGoal = JSON.parse(evt.data.newValue);
    let today = new Date();
    let time = schedUtils.hourAndMinToTime(today.getHours(), today.getMinutes())
    console.log(`seperator: ${sepratorGoal}`);
    if (schedUtils.isInSchedule(sched, time)){
      if (sepratorGoal){
        let scaledNow = schedUtils.timeToMin(time)-schedUtils.timeToMin(schedUtils.getStartofDay(sched))
        let scaledEnd = schedUtils.timeToMin(schedUtils.getEndofDay(sched))-schedUtils.timeToMin(schedUtils.getStartofDay(sched))
        console.log(`scaledNow: ${scaledNow}, scaledEnd: ${scaledEnd} `)
        seperatorLineRight.style.fill = util.goalToColor(scaledNow, scaledEnd);
        seperatorLineLeft.style.fill = util.goalToColor(scaledNow, scaledEnd);
      }
    }
  }
  if (evt.data.key === "dataAgeToggle" && evt.data.newValue) {
    showDataAge = JSON.parse(evt.data.newValue);
    console.log(`Data Age: ${showDataAge}`);
    weather.fetch();
  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.close = () => {
  console.log("App Socket Closed");
};

//----------------Weather Setup------------------------
import Weather from '../subModules/fitbit-weather/common/weather/device';

let weather = new Weather();
weather.setProvider("yahoo"); 
weather.setApiKey("dj0yJmk9TTkyWW5SNG5rT0JOJmQ9WVdrOVRVMURkRmhhTlRBbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD00MA--");
weather.setMaximumAge(updateInterval * 60 * 1000); 
weather.setFeelsLike(false);

weather.onsuccess = (data) => {
  console.log("Weather is " + JSON.stringify(data));
  weather.setMaximumAge(updateInterval * 60 * 1000); 
  var time = new Date();
  time = schedUtils.hourAndMinToMin(time.getHours(), time.getMinutes());
  var timeStamp = new Date(data.timestamp);
  timeStamp = schedUtils.hourAndMinToMin(timeStamp.getHours(), timeStamp.getMinutes());
  var dataAge = time - timeStamp;
  console.log("Time: " + time + ", TimeStamp: " + timeStamp);
  var unit = "m"
  if (dataAge > 60){
    dataAge = parseInt(dataAge/60);
    unit = "h"
  }
  tempAndConditionLabel.text = `${data.temperatureF}° ${data.description}`;
  if (showDataAge)
    weatherLocationLabel.text = `${data.location} (${dataAge}${unit})`;
  else
    weatherLocationLabel.text = `${data.location}`;
  
  switch(data.conditionCode){
    case 0:
      if (data.isDay)
        weatherImage.href = "../resources/icons/weather/whiteSun.png"
      else
        weatherImage.href = "../resources/icons/weather/whiteMoon.png" 
      break;
    case 1:
    case 2:
      if (data.isDay)
        weatherImage.href = "../resources/icons/weather/whitePartlySunny.png"
      else
        weatherImage.href = "../resources/icons/weather/whitePartlyMoon.png"
      break;
    case 3:
      weatherImage.href = "../resources/icons/weather/whiteCloud.png"
      break;
    case 4:
      weatherImage.href = "../resources/icons/weather/whiteRain.png"
      break;
    case 5:
      weatherImage.href = "../resources/icons/weather/whiteStorm.png"
      break;
    case 6:
      weatherImage.href = "../resources/icons/weather/whiteStorm.png"
      break;
    case 7:
      weatherImage.href = "../resources/icons/weather/whiteSnow.png"
      break;
    case 8:
      weatherImage.href = "../resources/icons/weather/whiteHaze .png"
      break;
    default:
      if (data.isDay)
        weatherImage.href = "../resources/icons/weather/whiteSun.png"
      else
        weatherImage.href = "../resources/icons/weather/whiteMoon.png"
      break;
  }
  
}

weather.onerror = (error) => {
  console.log("Weather error " + JSON.stringify(error));
  weatherImage.href = "";
  weather.setMaximumAge(0 * 60 * 1000); 

}



//-----------------End Weather Setup--------------

//-------------------------------Update Functions-----------------

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
  
  dateLabel.text = `${util.toDay(day, "long")}, ${util.toMonth(month)} ${date}`;
  clockLabel.text = `${hours}:${mins}${ampm}`;
  
  
  //updatePeriodData();
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
  if (show == "clock"){
    let today = new Date();
    let time = schedUtils.hourAndMinToTime(today.getHours(), today.getMinutes());
    if (fakeTime) let time = "11:08a";
    //console.log(`updatePeriod is: ${sched}`);
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

      if (sepratorGoal){
        let scaledNow = schedUtils.timeToMin(time)-schedUtils.timeToMin(schedUtils.getStartofDay(sched))
        let scaledEnd = schedUtils.timeToMin(schedUtils.getEndofDay(sched))-schedUtils.timeToMin(schedUtils.getStartofDay(sched))
        console.log(`scaledNow: ${scaledNow}, scaledEnd: ${scaledEnd} `)
        seperatorLineRight.style.fill = util.goalToColor(scaledNow, scaledEnd);
        seperatorLineLeft.style.fill = util.goalToColor(scaledNow, scaledEnd);
      } else {
        seperatorLineRight.style.fill = color;
        seperatorLineLeft.style.fill = color;
      }
    } else {
      periodLabel.text = ``;
      timeRemainingLabel.text = ``;
      seperatorLineRight.style.fill = color;
      seperatorLineLeft.style.fill = color;
    }
  }
}

function updateStatsData(){
  if (show == "stats" && display.on){
    stepStatsLabel.style.fill = util.goalToColor(today.local.steps, goals.steps);
    stepStatsLabel.text = `Steps: ${today.local.steps ? today.local.steps.toLocaleString() : 0} / ${goals.steps.toLocaleString()}`;

    // Multiply by .000621371 to convert from meters to miles
    distStatsLabel.style.fill = util.goalToColor(today.local.distance, goals.distance);
    distStatsLabel.text = `Distance: ${today.local.distance ? util.round2(today.local.distance * 0.000621371) : 0 } / ${util.round2(goals.distance*0.000621371)}`;

    floorsStatsLabel.style.fill = util.goalToColor(today.local.elevationGain, goals.elevationGain);
    floorsStatsLabel.text = `Floors: ${today.local.elevationGain ? today.local.elevationGain : 0} / ${goals.elevationGain}`;

    activeStatsLabel.style.fill = util.goalToColor(today.local.activeMinutes, goals.activeMinutes);
    activeStatsLabel.text = `Active: ${today.local.activeMinutes ? today.local.activeMinutes.toLocaleString() : 0} / ${goals.activeMinutes}`;

    calsStatsLabel.style.fill = util.goalToColor(today.local.calories, goals.calories);
    calsStatsLabel.text = `Calories: ${today.local.calories ? today.local.calories.toLocaleString() : 0} / ${parseInt(goals.calories).toLocaleString()}`;
  }
}
  
function updateScheduleData(){
  if (show == "schedule" && display.on){
    let today = new Date();
    let time = schedUtils.hourAndMinToTime(today.getHours(), today.getMinutes());
    if (fakeTime)let time = "11:08a";
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
    } for (let j = i; j < periodLabels.length; j++){
      periodLabels[j].start.text = ``;
      periodLabels[j].name.text = ``;
      periodLabels[j].end.text = ``;
    }
  }
}

//------------------Event Handleing--------------------

background.onclick = function(evt) {
  console.log("Click");
  let today = new Date();
  let time = schedUtils.hourAndMinToTime(today.getHours(), today.getMinutes())
  if (fakeTime) let time = "11:08a";
  if (show == "clock"){           // In Clock -> Switching to Stats
    show = "stats";
    updateStatsData()
    clockView.style.display = "none";
    periodView.style.display = "none";
    weatherView.style.display = "none";
    statsView.style.display = "inline";
    scheduleView.style.display = "none";
    console.log("stats Loaded");
    display.poke()
  } else if (show == "stats"){                   // In Stats -> Switching to Clock or schedule    
    if (schedUtils.isInSchedule(sched, time)){  
      show = "schedule";
      updateScheduleData();
      clockView.style.display = "none";
      periodView.style.display = "none";
      weatherView.style.display = "none";
      statsView.style.display = "none";
      scheduleView.style.display = "inline";
      console.log("schedule Loaded");
    } else {
      show = "clock";
      updateClock();
      updateClockData();
      weather.fetch();
      clockView.style.display = "inline";//test
      periodView.style.display = "none";
      weatherView.style.display = "inline";//test
      statsView.style.display = "none";
      scheduleView.style.display = "none";
      console.log("Clock Loaded");

    } 
  } else {                                  // In Schedule -> Switching to Clock
    show = "clock";
    updateClock();
    updateClockData();
    clockView.style.display = "inline";//test
    if (schedUtils.isInSchedule(sched, time)){ 
      periodView.style.display = "inline";
      weatherView.style.display = "none";
    } else {
      weather.fetch();
      periodView.style.display = "none";
      weatherView.style.display = "inline";//test
    }
    statsView.style.display = "none";
    scheduleView.style.display = "none";
    console.log("Clock Loaded");

  }
  //console.log("ShowClock is " + showClock);
}

display.onchange = function() {
  if (display.on) {
    let today = new Date();
    let time = schedUtils.hourAndMinToTime(today.getHours(), today.getMinutes());
    hrm.start();
    show = "clock";
    updateClock();
    updateClockData();
    updatePeriodData();
    clockView.style.display = "inline"; //test
    console.log("Sced test: " + schedUtils.isInSchedule(sched, time));
    if (schedUtils.isInSchedule(sched, time)){ 
      periodView.style.display = "inline";
      weatherView.style.display = "none";
    } else {
      weather.fetch();
      periodView.style.display = "none";
      weatherView.style.display = "inline";//test
    }
    statsView.style.display = "none";
    scheduleView.style.display = "none";
  } else {
    hrm.stop();
  }
}

//-----------------Startup------------------------

// Update the clock every tick event
clock.ontick = () => updateClock();
setInterval(updateClockData, 3000);
setInterval(updatePeriodData, 15000);

// Don't start with a blank screen
updateClock();
updateClockData();
updatePeriodData();
weather.fetch();
hrm.start();
