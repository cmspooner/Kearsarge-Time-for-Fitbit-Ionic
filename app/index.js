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
import { battery } from "power";

import * as util from "../common/utils";
import * as schedUtils from "scheduleUtils.js";

import { me as device } from "device";
if (!device.screen) device.screen = { width: 348, height: 250 };
console.log(`Dimensions: $‌{device.screen.width}x$‌{device.screen.height}`);

var sched = "Regular";

var sepratorGoal = true;
var color = "deepskyblue";
var updateInterval = 30;
var showDataAge = false;
var degreesF = true;
var failCount = 0;
var showFailCount = false;
var showError = false;
var weatherData;

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
let forecastView = document.getElementById("forecast");

// Get a handle on the <text> element
// Clock view
let clockLabel = document.getElementById("clockLabel");
let seperatorEndLeft = document.getElementById("seperatorEndLeft");
let seperatorLine = document.getElementById("seperatorLine");
let seperatorEndRight = document.getElementById("seperatorEndRight");
let dateLabel = document.getElementById("dateLabel");
let batteryLevelLabel = document.getElementById("batteryLevelLabel");
let hrLabel = document.getElementById("hrLabel");
let stepsLabel = document.getElementById("stepsLabel");
if (device.screen.height == 300)
  let calsLabel = document.getElementById("calsLabel");

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
if (device.screen.height == 300){
  let stepValueLabel = document.getElementById("stepValueLabel");
  let stepGoalLabel = document.getElementById("stepGoalLabel");
  
  let distValueLabel = document.getElementById("distValueLabel");
  let distGoalLabel = document.getElementById("distGoalLabel");
  
  let floorsValueLabel = document.getElementById("floorsValueLabel");
  let floorsGoalLabel = document.getElementById("floorsGoalLabel");
  
  let activeValueLabel = document.getElementById("activeValueLabel");
  let activeGoalLabel = document.getElementById("activeGoalLabel");
  
  let calsValueLabel = document.getElementById("calsValueLabel");
  let calsGoalLabel = document.getElementById("calsGoalLabel");
}

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

// Forecast View
let todayDateLabel = document.getElementById("todayDateLabel");
let todayWeatherImage = document.getElementById("todayWeatherImage");
let weatherImage = document.getElementById("weatherImage");
let todayDescriptionLabel = document.getElementById("todayDescriptionLabel");
let todayHighLabel = document.getElementById("todayHighLabel");
let todayHighValLabel = document.getElementById("todayHighValLabel");
let todayLowLabel = document.getElementById("todayLowLabel");
let todayLowValLabel = document.getElementById("todayLowValLabel");

let tomorrowDateLabel = document.getElementById("tomorrowDateLabel");
let tomorrowWeatherImage = document.getElementById("tomorrowWeatherImage");
let weatherImage = document.getElementById("weatherImage");
let tomorrowDescriptionLabel = document.getElementById("tomorrowDescriptionLabel");
let tomorrowHighLabel = document.getElementById("tomorrowHighLabel");
let tomorrowHighValLabel = document.getElementById("tomorrowHighValLabel");
let tomorrowLowLabel = document.getElementById("tomorrowLowLabel");
let tomorrowLowValLabel = document.getElementById("tomorrowLowValLabel");

let day3DateLabel = document.getElementById("day3DateLabel");
let day3WeatherImage = document.getElementById("day3WeatherImage");
let day3Image = document.getElementById("day3Image");
let day3DescriptionLabel = document.getElementById("day3DescriptionLabel");
let day3HighLabel = document.getElementById("day3HighLabel");
let day3HighValLabel = document.getElementById("day3HighValLabel");
let day3LowLabel = document.getElementById("day3LowLabel");
let day3LowValLabel = document.getElementById("day3LowValLabel");

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
    seperatorEndLeft.style.fill = color;
    seperatorLine.style.fill = color;
    seperatorEndRight.style.fill = color;
  }
  if (evt.data.key === "schedule" && evt.data.newValue) {
    sched = JSON.parse(evt.data.newValue).values[0].name;
    console.log(`Schedule is: ${sched}`);
    let today = new Date();
    let time = schedUtils.hourAndMinToTime(today.getHours(), today.getMinutes());
    if (fakeTime) time = "11:08a";
    if (schedUtils.isInSchedule(sched, time)){
      updatePeriodData();
      periodView.style.display = "inline";
      weatherView.style.display = "none";
    }else{
      weather.fetch();
      periodView.style.display = "none";
      weatherView.style.display = "inline";
    }
  }
  if (evt.data.key === "seperatorToggle" && evt.data.newValue) {
    sepratorGoal = JSON.parse(evt.data.newValue);
    let today = new Date();
    let time = schedUtils.hourAndMinToTime(today.getHours(), today.getMinutes())
    if (fakeTime) time = "11:08a";
    console.log(`seperator: ${sepratorGoal}`);
    if (schedUtils.isInSchedule(sched, time)){
      if (sepratorGoal){
        let scaledNow = schedUtils.timeToMin(time)-schedUtils.timeToMin(schedUtils.getStartofDay(sched))
        let scaledEnd = schedUtils.timeToMin(schedUtils.getEndofDay(sched))-schedUtils.timeToMin(schedUtils.getStartofDay(sched))
        console.log(`scaledNow: ${scaledNow}, scaledEnd: ${scaledEnd} `)
        seperatorEndLeft.style.fill = util.goalToColor(scaledNow, scaledEnd);
        seperatorLine.style.fill = util.goalToColor(scaledNow, scaledEnd);
        seperatorEndRight.style.fill = util.goalToColor(scaledNow, scaledEnd);
      }
    }
  }
  if (evt.data.key === "dataAgeToggle" && evt.data.newValue) {
    showDataAge = JSON.parse(evt.data.newValue);
    console.log(`Data Age: ${showDataAge}`);
    weather.fetch();
  }
  if (evt.data.key === "unitToggle" && evt.data.newValue) {
    degreesF = !JSON.parse(evt.data.newValue);
    console.log(`Fahrenheit: ${degreesF}`);
    weather.fetch();
  }
  if (evt.data.key === "errorMessageToggle" && evt.data.newValue) {
    showError = JSON.parse(evt.data.newValue);
    console.log(`Show Error: ${showError}`);
    weather.fetch();
  }
  if (evt.data.key === "failCountToggle" && evt.data.newValue) {
    showFailCount = JSON.parse(evt.data.newValue);
    console.log(`Data Age: ${showFailCount}`);
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
import Weather from '../common/weather/device';

let weather = new Weather();
weather.setProvider("yahoo"); 
weather.setApiKey("dj0yJmk9TTkyWW5SNG5rT0JOJmQ9WVdrOVRVMURkRmhhTlRBbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD00MA--");
weather.setMaximumAge(updateInterval * 60 * 1000); 
weather.setFeelsLike(false);

weather.onsuccess = (data) => {
  weatherData = data;
  console.log("Weather is " + JSON.stringify(data));
  failCount = 0;
  weather.setMaximumAge(updateInterval * 60 * 1000); 
  var time = new Date();
  time = schedUtils.hourAndMinToMin(time.getHours(), time.getMinutes());
  if (fakeTime) time = "11:08a";
  var timeStamp = new Date(data.timestamp);
  //timeStamp = schedUtils.hourAndMinToMin(timeStamp.getHours(), timeStamp.getMinutes());
  timeStamp = schedUtils.hourAndMinToTime(timeStamp.getHours(), timeStamp.getMinutes());

  var dataAge = time - timeStamp;
  console.log("Time: " + time + ", TimeStamp: " + timeStamp);
  var unit = "m"
  if (dataAge > 60){
    dataAge = parseInt(dataAge/60);
    unit = "h"
  }
  //data.description = 	"Isolated Thunderstorms";
  if (degreesF)
    tempAndConditionLabel.text = `${data.temperatureF}° ${util.shortenText(data.description)}`;
  else 
    tempAndConditionLabel.text = `${data.temperatureC}° ${util.shortenText(data.description)}`;
  
  if (showDataAge)
    //weatherLocationLabel.text = `${data.location} (${dataAge}${unit})`;
        weatherLocationLabel.text = `${data.location} (${timeStamp})`;

  else
    weatherLocationLabel.text = `${data.location}`;
  
  weatherImage.href = util.getWeatherIcon(data);  
}

weather.onerror = (error) => {
  console.log("Weather error " + JSON.stringify(error));
  if (error == "No connection with the companion")
       error = "Companion Failure"
  if (JSON.stringify(error) == "{}")
       error = "Unknown"
  if (!weatherData){
    weatherImage.href = "";
    weather.setMaximumAge(15 * 1000); 
    failCount++;
    if (showFailCount)
      tempAndConditionLabel.text = `Updating, try ${failCount}`;
    else
      tempAndConditionLabel.text = "Updating...";
    if (showError)
      weatherLocationLabel.text = `${error}`;
    else
      weatherLocationLabel.text = ``;
  } else {
      if (degreesF)
        tempAndConditionLabel.text = `${weatherData.temperatureF}° ${util.shortenText(weatherData.description)}`;
      else 
        tempAndConditionLabel.text = `${weatherData.temperatureC}° ${util.shortenText(weatherData.description)}`;
  
      if (showDataAge)
        //weatherLocationLabel.text = `${data.location} (${dataAge}${unit})`;
        if (showError)
          weatherLocationLabel.text = `${error}, (${timeStamp})`;
        else
          weatherLocationLabel.text = `Updating, (${timeStamp})`;
      else
        weatherLocationLabel.text = `Updating...`;
  
    weatherImage.href = util.getWeatherIcon(weatherData);  
  }

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
  
  dateLabel.text = `${util.toDay(day, "short")}, ${util.toMonth(month)} ${date}`;
  //dateLabel.text = `Wednesday, Mar. 21`;

  batteryLevelLabel.style.fill = util.goalToColor(battery.chargeLevel, 90)
  batteryLevelLabel.text = `${battery.chargeLevel}%`
  //batteryLevelLabel.text = `100%`
  clockLabel.text = `${hours}:${mins}${ampm}`;
  
  
  //updatePeriodData();
}

function updateClockData() {
  if (show == "clock" && display.on){
    if (device.screen.height == 300) {
      let data = {
        heart: {
          theHeartRate: hrm.heartRate ? hrm.heartRate : 0
        },
        step: {
          steps: today.local.steps ? today.local.steps: 0
        },
        cal: {
          cals: today.local.calories ? today.local.calories: 0
        }
      };
    } else {
      let data = {
        heart: {
          theHeartRate: hrm.heartRate ? hrm.heartRate : 0
        },
        step: {
          steps: today.local.steps ? today.local.steps: 0
        }
      };
    }

    //console.log("Data:");
    //console.log(data.heart.theHeartRate);
    //console.log(data.step.steps.toLocaleString());

    hrLabel.style.fill = 'white';
    stepsLabel.style.fill = 'white';
    if (device.screen.height == 300)
      calsLabel.style.fill = 'white';
    
    
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
    if (device.screen.height == 300) {
      calsLabel.style.fill = util.goalToColor(data.cal.cals, goals.calories);
      calsLabel.text = `${data.cal.cals.toLocaleString()} kcal`;
    }
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
        seperatorEndLeft.style.fill = util.goalToColor(scaledNow, scaledEnd);
        seperatorLine.style.fill = util.goalToColor(scaledNow, scaledEnd);
        seperatorEndRight.style.fill = util.goalToColor(scaledNow, scaledEnd);
      } else {
        seperatorEndLeft.style.fill = color;
        seperatorLine.style.fill = color;
        seperatorEndRight.style.fill = colorl;
      }
    } else {
      periodLabel.text = ``;
      timeRemainingLabel.text = ``;
      seperatorEndLeft.style.fill = color;
      seperatorLine.style.fill = color;
      seperatorEndRight.style.fill = color;
    }
  }
}

function updateStatsData(){
  if (show == "stats" && display.on){
    if (device.screen.height == 300) {
      stepStatsLabel.style.fill = util.goalToColor(today.local.steps, goals.steps);
      stepStatsLabel.text = "Steps:";
      stepValueLabel.style.fill = util.goalToColor(today.local.steps, goals.steps);
      stepValueLabel.text = `${today.local.steps ? today.local.steps.toLocaleString() : 0} of `;
      stepGoalLabel.style.fill = util.goalToColor(today.local.steps, goals.steps);
      stepGoalLabel.text = `${goals.steps.toLocaleString()}`;
      
      distStatsLabel.style.fill = util.goalToColor(today.local.distance, goals.distance);
      distStatsLabel.text = "Distance:";
      distValueLabel.style.fill = util.goalToColor(today.local.distance, goals.distance);
      distValueLabel.text = `${today.local.distance ? util.round2(today.local.distance * 0.000621371) : 0 } of `;
      distGoalLabel.style.fill = util.goalToColor(today.local.distance, goals.distance);
      distGoalLabel.text = `${util.round2(goals.distance*0.000621371)}.00`;
       
      floorsStatsLabel.style.fill = util.goalToColor(today.local.elevationGain, goals.elevationGain);
      floorsStatsLabel.text = "Floors:";
      floorsValueLabel.style.fill = util.goalToColor(today.local.elevationGain, goals.elevationGain);
      floorsValueLabel.text = `${today.local.elevationGain ? today.local.elevationGain.toLocaleString() : 0} of `;
      floorsGoalLabel.style.fill = util.goalToColor(today.local.elevationGain, goals.elevationGain);
      floorsGoalLabel.text = `${goals.elevationGain.toLocaleString()}`;
      
      activeStatsLabel.style.fill = util.goalToColor(today.local.activeMinutes, goals.activeMinutes);
      activeStatsLabel.text = "Active:";
      activeValueLabel.style.fill = util.goalToColor(today.local.activeMinutes, goals.activeMinutes);
      activeValueLabel.text = `${today.local.activeMinutes ? today.local.activeMinutes.toLocaleString() : 0} of `;
      activeGoalLabel.style.fill = util.goalToColor(today.local.activeMinutes, goals.activeMinutes);
      activeGoalLabel.text = `${goals.activeMinutes.toLocaleString()}`;
 
      calsStatsLabel.style.fill = util.goalToColor(today.local.calories, goals.calories);
      calsStatsLabel.text = "Calories:";
      calsValueLabel.style.fill = util.goalToColor(today.local.calories, goals.calories);
      calsValueLabel.text = `${today.local.calories ? today.local.calories.toLocaleString() : 0} of `;
      calsGoalLabel.style.fill = util.goalToColor(today.local.calories, goals.calories);
      calsGoalLabel.text = `${goals.calories.toLocaleString()}`;
    } else {
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

function updateForecastData(){
  if (show == "forecast" && display.on){
    let today = new Date();
    let day = today.getDay()
    
    todayDateLabel.text  = "Today";
    todayWeatherImage.href = util.getForecastIcon(weatherData.todayCondition);
    console.log("Today Code: " + weatherData.todayCondition)
    todayDescriptionLabel.text = weatherData.todayDescription;
    todayHighLabel.text = "High:"
    if (degreesF)
      todayHighValLabel.text = weatherData.todayHighF + "°"
    else
      todayHighValLabel.text = weatherData.todayHighC + "°"
    todayLowLabel.text = "Low:"
    if (degreesF)
      todayLowValLabel.text = weatherData.todayLowF + "°"
    else
      todayLowValLabel.text = weatherData.todayLowC + "°"
    
    tomorrowDateLabel.text = util.toDay(day+1, "long");
    tomorrowWeatherImage.href = util.getForecastIcon(weatherData.tomorrowCondition);
    console.log("Tomorrow Code: " + weatherData.tomorrowCondition)
    tomorrowDescriptionLabel.text = weatherData.tomorrowDescription;
    tomorrowHighLabel.text = "High:"
    if (degreesF)
      tomorrowHighValLabel.text = weatherData.tomorrowHighF + "°"
    else
      tomorrowHighValLabel.text = weatherData.tomorrowHighC + "°"
    tomorrowLowLabel.text = "Low:"
    if (degreesF)
      tomorrowLowValLabel.text = weatherData.tomorrowLowF + "°"
    else
      tomorrowLowValLabel.text = weatherData.tomorrowLowC + "°"
    
    day3DateLabel.text = util.toDay(day+2, "long");
    day3WeatherImage.href = util.getForecastIcon(weatherData.day3Condition);
    console.log("day3 Code: " + weatherData.day3Condition)
    day3DescriptionLabel.text = weatherData.day3Description;
    day3HighLabel.text = "High:"
    if (degreesF)
      day3HighValLabel.text = weatherData.day3HighF + "°"
    else
      day3HighValLabel.text = weatherData.day3HighC + "°"
    day3LowLabel.text = "Low:"
    if (degreesF)
      day3LowValLabel.text = weatherData.day3LowF + "°"
    else
      day3LowValLabel.text = weatherData.day3LowC + "°"
  }
}

//------------------Event Handleing--------------------

background.onclick = function(evt) {
  console.log("Click");
  let today = new Date();
  let time = schedUtils.hourAndMinToTime(today.getHours(), today.getMinutes())
  if (fakeTime) time = "11:08a";
  if (show == "clock"){           // In Clock -> Switching to Stats
    show = "stats";
    updateStatsData()
    clockView.style.display = "none";
    periodView.style.display = "none";
    weatherView.style.display = "none";
    statsView.style.display = "inline";
    scheduleView.style.display = "none";
    forecastView.style.display = "none";
    console.log("stats Loaded");
    display.poke()
  } else if (show == "stats"){                   // In Stats -> Switching to forcast or schedule    
    if (schedUtils.isInSchedule(sched, time)){  
      show = "schedule";
      updateScheduleData();
      clockView.style.display = "none";
      periodView.style.display = "none";
      weatherView.style.display = "none";
      statsView.style.display = "none";
      scheduleView.style.display = "inline";
      forecastView.style.display = "none";
      console.log("schedule Loaded");
    } else {
      show = "forecast";
      updateClock();
      updateClockData();
      weather.fetch();
      updateForecastData();
      clockView.style.display = "none";//test
      periodView.style.display = "none";
      weatherView.style.display = "none";//test
      statsView.style.display = "none";
      scheduleView.style.display = "none";
      forecastView.style.display = "inline";//test
      console.log("forecast Loaded");

    } 
  } else {                                  // In Schedule -> Switching to Clock
    show = "clock";
    updateClock();
    updateClockData();
    clockView.style.display = "inline";//test
    if (schedUtils.isInSchedule(sched, time)){ 
      updatePeriodData();
      periodView.style.display = "inline";
      weatherView.style.display = "none";
    } else {
      weather.fetch();
      periodView.style.display = "none";
      weatherView.style.display = "inline";//test
    }
    statsView.style.display = "none";
    scheduleView.style.display = "none";
    forecastView.style.display = "none";
    console.log("Clock Loaded");

  }
  //console.log("ShowClock is " + showClock);
}

display.onchange = function() {
  if (display.on) {
    let today = new Date();
    let time = schedUtils.hourAndMinToTime(today.getHours(), today.getMinutes());
    if (fakeTime) time = "11:08a";
    hrm.start();
    show = "clock";
    updateClock();
    updateClockData();
    clockView.style.display = "inline"; //test
    console.log("Sced test: " + schedUtils.isInSchedule(sched, time));
    if (schedUtils.isInSchedule(sched, time)){ 
      updatePeriodData();
      periodView.style.display = "inline";
      weatherView.style.display = "none";
    } else {
      weather.fetch();
      periodView.style.display = "none";
      weatherView.style.display = "inline";//test
    }
    statsView.style.display = "none";
    scheduleView.style.display = "none";
    forecastView.style.display = "none";
  } else {
    hrm.stop();
  }
}

//-----------------Startup------------------------

// Update the clock every tick event
clock.ontick = () => updateClock();
setInterval(updateClockData, 3*1000);
setInterval(updatePeriodData, 15*1000);
setInterval(weather.fetch, updateInterval*60*1000);

// Don't start with a blank screen
updateClock();
updateClockData();
updatePeriodData();
weather.fetch();
hrm.start();
