console.log("Kearsarge Time Started");

/*
 * Entry point for the watch app
 */
import clock from "clock";
import { me } from "appbit";
import document from "document";
import * as fs from "fs";

import * as messaging from "messaging";

import { HeartRateSensor } from "heart-rate";
import { today as todayActivity} from "user-activity";
import { goals } from "user-activity";
import { user } from "user-profile";
import { display } from "display";
import { preferences } from "user-settings";
import { units } from "user-settings";
import { vibration } from "haptics"
import { battery } from "power";
import { memory } from "system";
console.log("JS memory: " + memory.js.used + "/" + memory.js.total);

import * as util from "../common/utils";
import * as schedUtils from "scheduleUtils.js";

import { me as device } from "device";
if (!device.screen) device.screen = { width: 348, height: 250 };
let deviceType = "Ionic";
if (device.screen.width == 300 && device.screen.height == 300)
  deviceType = "Versa";



let sched = "Regular";
let inSched = false;

let userUnits =  units.temperature.toLowerCase();
let failCount = 0;



let today = new Date();
let time = schedUtils.hourAndMinToTime(today.getHours(), today.getMinutes());

// Update the clock every minute
clock.granularity = "minutes";

let background = document.getElementById("clickbg");

let didVib = false;
let show = "clock";
let weatherInterval = null;
let periodInterval = null;
let openedWeatherRequest = false;

// Heart Rate Monitor
let hrm = new HeartRateSensor();

//----------------------------Messaging and Settings--------------

let settings = loadSettings();
let weatherData = null;

messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === "updateInterval" && evt.data.newValue) {
    let oldInterval = settings.updateInterval;
    settings.updateInterval = JSON.parse(evt.data.newValue).values[0].name
    setUpdateInterval(oldInterval);
  }
  if (evt.data.key === "locationUpdateInterval" && evt.data.newValue) {
    let oldInterval = settings.updateLocationInterval;
    settings.updateLocationInterval = JSON.parse(evt.data.newValue).values[0].name
    setLocationUpdateInterval(oldInterval);
  }
  if (evt.data.key === "color" && evt.data.newValue) {
    settings.color = JSON.parse(evt.data.newValue);
    setColor();
  }
  if (evt.data.key === "schedule" && evt.data.newValue) {
    settings.schedule = JSON.parse(evt.data.newValue).values[0].name;
    setSchedule();
  }
  if (evt.data.key === "seperatorToggle" && evt.data.newValue) {
    settings.sepratorGoal = JSON.parse(evt.data.newValue);
    setSeperator();
  }
  if (evt.data.key === "dataAgeToggle" && evt.data.newValue) {
    settings.showDataAge = JSON.parse(evt.data.newValue);
    setDataAge();
  }
  if (evt.data.key === "unitToggle" && evt.data.newValue) {
    settings.unitToggle = JSON.parse(evt.data.newValue) 
    setUnit();
  }
  if (evt.data.key === "errorMessageToggle" && evt.data.newValue) {
    settings.showError = JSON.parse(evt.data.newValue);
  }
  if (evt.data.key === "failCountToggle" && evt.data.newValue) {
    settings.showFailCount = JSON.parse(evt.data.newValue);
  }  
  if (evt.data.key === "weatherScrollToggle" && evt.data.newValue) {
    settings.weatherScrollToggle = JSON.parse(evt.data.newValue);
    setWeatherScroll();
  }
  if (evt.data.key === "locationScrollToggle" && evt.data.newValue) {
    settings.locationScrollToggle = JSON.parse(evt.data.newValue);
    setLocationScroll();
  }
  saveSettings();
  console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
  weather.fetch();
  openedWeatherRequest = true;
};

// Message socket closes
messaging.peerSocket.close = () => {
  console.log("App Socket Closed");
};

//----------------Weather Setup------------------------
import Weather from '../common/weather/device';

let weather = new Weather();
weather.setProvider("yahoo"); 
weather.setApiKey("");
weather.setMaximumAge(settings.updateInterval * 60 * 1000); 
weather.setFeelsLike(false);
weather.setUnit(userUnits);

applySettings();

if (settings.noFile){
  console.log("No Settings File");
  weather.fetch();
}

weather.onsuccess = (data) => {
  // Weather View
  let tempAndConditionLabel = document.getElementById("tempAndConditionLabel");
  tempAndConditionLabel.text = "Updating...";
  let weatherLocationLabel = document.getElementById("weatherLocationLabel");
  let weatherImage = document.getElementById("weatherImage");
  
  weatherData = data;
  failCount = 0;
  openedWeatherRequest = false;
  weather.setMaximumAge(settings.updateInterval * 60 * 1000); 
  if (weatherInterval != null)
    clearInterval(weatherInterval);
  weatherInterval = setInterval(fetchWeather,settings.updateInterval * 60 * 1000);
  //var time = new Date();
  //time = schedUtils.hourAndMinToTime(time.getHours(), time.getMinutes());

  tempAndConditionLabel.text = `${data.temperature}° ${util.shortenText(data.description)}`;
  let timeStamp = new Date(weatherData.timestamp);
  if (settings.showDataAge)
    weatherLocationLabel.text = `${util.shortenText(data.location)} (${schedUtils.hourAndMinToTime(timeStamp.getHours(), timeStamp.getMinutes())})`;
  else
    weatherLocationLabel.text = `${util.shortenText(data.location)}`;
  
  weatherImage.href = util.getWeatherIcon(data);  
}

weather.onerror = (error) => {
  console.log("Weather error " + JSON.stringify(error));
  weather.setMaximumAge(30 * 1000); 
  openedWeatherRequest = false;
  if (weatherInterval != null)
    clearInterval(weatherInterval);
  weatherInterval = setInterval(fetchWeather,30 * 1000);
  if (error == "No connection with the companion")
       error = "Companion Failure"
  if (JSON.stringify(error) == "{}")
       error = "Unknown"
  if (!weatherData){
    weatherImage.href = "";
    
    failCount++;
    if (settings.showFailCount)
      tempAndConditionLabel.text = `Updating, try ${failCount}`;
    else
      tempAndConditionLabel.text = "Updating...";
    if (settings.showError)
      weatherLocationLabel.text = `${error}`;
    else
      weatherLocationLabel.text = ``;
  } else {
      tempAndConditionLabel.text = `${weatherData.temperature}° ${util.shortenText(weatherData.description)}`;
      if (settings.showError)
        weatherLocationLabel.text = `${error}`;
      else
        weatherLocationLabel.text = `Updating...`;
      weatherImage.href = util.getWeatherIcon(weatherData);  
  }
}



//-----------------End Weather Setup--------------

//-------------------------------Update Functions-----------------

// Update the <text> element with the current time
function updateClock() {
  // Clock view
  let clockLabel = document.getElementById("clockLabel");
  let dateLabel = document.getElementById("dateLabel");
  let batteryLevelLabel = document.getElementById("batteryLevelLabel");

  today = new Date();
  time = schedUtils.hourAndMinToTime(today.getHours(), today.getMinutes());
  //let year = today.getYear()-100+2000;
  let hours = today.getHours();
  let mins = util.zeroPad(today.getMinutes());
  let ampm = " am";
  
  
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
  
  dateLabel.text = `${util.toDay(today.getDay(), "short")}, ${util.toMonth(today.getMonth())} ${today.getDate()}`;

  batteryLevelLabel.style.fill = util.goalToColor(battery.chargeLevel, 90)
  batteryLevelLabel.text = `${battery.chargeLevel}%`
  clockLabel.text = `${hours}:${mins}${ampm}`;
}

function updateClockData() {
  if (show == "clock" && display.on){
    let hrLabel = document.getElementById("hrLabel");
    let stepsLabel = document.getElementById("stepsLabel");
    if (deviceType == "Versa")
      let calsLabel = document.getElementById("calsLabel");
    
    hrLabel.style.fill = 'white';
    stepsLabel.style.fill = 'white';
    if (deviceType == "Versa")
      calsLabel.style.fill = 'white';
    
    if (!hrm.heartRate || hrm.heartRate == 0) {
        hrLabel.text = `--`;
    } else {
        if (user.heartRateZone(hrm.heartRate) == "out-of-range"){
          hrLabel.style.fill = 'fb-cyan';  // #14D3F5
        } else if (user.heartRateZone(hrm.heartRate) == "fat-burn"){
          hrLabel.style.fill = 'fb-mint'; // #5BE37D
        } else if (user.heartRateZone(harm.heartRate) == "cardio"){
          hrLabel.style.fill = 'fb-peach'; // #FFCC33
        } else if (user.heartRateZone(hrm.heartRate) == "peak"){
          hrLabel.style.fill = 'fb-red'; // #F83C40
        }
        hrLabel.text = `${hrm.heartRate} bpm`;
    }
    
    stepsLabel.style.fill = util.goalToColor(todayActivity.adjusted.steps ? todayActivity.adjusted.steps: 0, goals.steps);
    stepsLabel.text = `${(todayActivity.adjusted.steps ? todayActivity.adjusted.steps: 0).toLocaleString()} steps`;
    if (deviceType == "Versa") {
      calsLabel.style.fill = util.goalToColor(todayActivity.adjusted.calories ? todayActivity.adjusted.calories: 0, goals.calories);
      calsLabel.text = `${(todayActivity.adjusted.steps ? todayActivity.adjusted.steps: 0).toLocaleString()} kcal`;
    }
  }
}

function updatePeriodData() {
  if (show == "clock"){
    let seperatorEndLeft = document.getElementById("seperatorEndLeft");
    let seperatorLine = document.getElementById("seperatorLine");
    let seperatorEndRight = document.getElementById("seperatorEndRight");
    
    // Period View
    let periodLabel = document.getElementById("periodLabel");
    let timeRemainingLabel = document.getElementById("timeRemainingLabel");
    
    let remaining = schedUtils.getTimeLeftInPeriod(sched, time);
    inSched = schedUtils.isInSchedule(sched, time)
    if (inSched){
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

      if (settings.sepratorGoal){
        let scaledNow = schedUtils.timeToMin(time)-schedUtils.timeToMin(schedUtils.getStartofDay(sched))
        let scaledEnd = schedUtils.timeToMin(schedUtils.getEndofDay(sched))-schedUtils.timeToMin(schedUtils.getStartofDay(sched))
        seperatorEndLeft.style.fill = util.goalToColor(scaledNow, scaledEnd);
        seperatorLine.style.fill = util.goalToColor(scaledNow, scaledEnd);
        seperatorEndRight.style.fill = util.goalToColor(scaledNow, scaledEnd);
      } else {
        seperatorEndLeft.style.fill = settings.color;
        seperatorLine.style.fill = settings.color;
        seperatorEndRight.style.fill = settings.color;
      }
    } else {
      periodLabel.text = ``;
      timeRemainingLabel.text = ``;
      seperatorEndLeft.style.fill = settings.color;
      seperatorLine.style.fill = settings.color;
      seperatorEndRight.style.fill = settings.color;
    }
  }
}

function updateStatsData(){
  if (show == "stats" && display.on){
    
    // Stats View
    let stepStatsLabel = document.getElementById("stepStatsLabel");
    let distStatsLabel = document.getElementById("distStatsLabel");
    let floorsStatsLabel = document.getElementById("floorsStatsLabel");
    let activeStatsLabel = document.getElementById("activeStatsLabel");
    let calsStatsLabel = document.getElementById("calsStatsLabel");
    
    if (deviceType == "Versa") {
      let stepGoalLabel = document.getElementById("stepGoalLabel");
      let distGoalLabel = document.getElementById("distGoalLabel");
      let floorsGoalLabel = document.getElementById("floorsGoalLabel");
      let activeGoalLabel = document.getElementById("activeGoalLabel");
      let calsGoalLabel = document.getElementById("calsGoalLabel");
      
      stepStatsLabel.style.fill = util.goalToColor(todayActivity.adjusted.steps, goals.steps);
      stepStatsLabel.text = "Steps:";
      stepGoalLabel.style.fill = util.goalToColor(todayActivity.adjusted.steps, goals.steps);
      stepGoalLabel.text = `${todayActivity.adjusted.steps ? todayActivity.adjusted.steps.toLocaleString() : 0} / ${goals.steps.toLocaleString()}`;
      
      distStatsLabel.style.fill = util.goalToColor(todayActivity.adjusted.distance, goals.distance);
      distStatsLabel.text = "Distance:";
      distGoalLabel.style.fill = util.goalToColor(todayActivity.adjusted.distance, goals.distance);
      if (units.distance == "us")
        distGoalLabel.text = `${todayActivity.adjusted.distance ? util.round2(todayActivity.adjusted.distance * 0.000621371) : 0 } / ${util.round2(goals.distance*0.000621371)}`;
      else
        distGoalLabel.text = `${todayActivity.adjusted.distance ? util.round2(todayActivity.adjusted.distance * 0.001) : 0 } / ${util.round2(goals.distance*0.001)}`;
      
      floorsStatsLabel.style.fill = util.goalToColor(todayActivity.adjusted.elevationGain, goals.elevationGain);
      floorsStatsLabel.text = "Floors:";
      floorsGoalLabel.style.fill = util.goalToColor(todayActivity.adjusted.elevationGain, goals.elevationGain);
      floorsGoalLabel.text = `${todayActivity.adjusted.elevationGain ? todayActivity.adjusted.elevationGain : 0} / ${goals.elevationGain}`;
      
      activeStatsLabel.style.fill = util.goalToColor(todayActivity.adjusted.activeMinutes, goals.activeMinutes);
      activeStatsLabel.text = "Active:";
      activeGoalLabel.style.fill = util.goalToColor(todayActivity.adjusted.activeMinutes, goals.activeMinutes);
      activeGoalLabel.text = `${todayActivity.adjusted.activeMinutes ? todayActivity.adjusted.activeMinutes.toLocaleString() : 0} / ${goals.activeMinutes}`;
 
      calsStatsLabel.style.fill = util.goalToColor(todayActivity.adjusted.calories, goals.calories);
      calsStatsLabel.text = "Calories:";
      calsGoalLabel.style.fill = util.goalToColor(todayActivity.adjusted.calories, goals.calories);
      calsGoalLabel.text = `${todayActivity.adjusted.calories ? todayActivity.adjusted.calories.toLocaleString() : 0} / ${parseInt(goals.calories).toLocaleString()}`;
    } else {
      stepStatsLabel.style.fill = util.goalToColor(todayActivity.adjusted.steps, goals.steps);
      stepStatsLabel.text = `Steps: ${todayActivity.adjusted.steps ? todayActivity.adjusted.steps.toLocaleString() : 0} / ${goals.steps.toLocaleString()}`;

      // Multiply by .000621371 to convert from meters to miles
      distStatsLabel.style.fill = util.goalToColor(todayActivity.adjusted.distance, goals.distance);
      if (units.distance == "us")
        distStatsLabel.text = `Distance: ${todayActivity.adjusted.distance ? util.round2(todayActivity.adjusted.distance * 0.000621371) : 0 } / ${util.round2(goals.distance*0.000621371)}`;
      else
         distStatsLabel.text = `Distance: ${todayActivity.adjusted.distance ? util.round2(todayActivity.adjusted.distance * 0.001) : 0 } / ${util.round2(goals.distance*0.001)}`;
      
      floorsStatsLabel.style.fill = util.goalToColor(todayActivity.adjusted.elevationGain, goals.elevationGain);
      floorsStatsLabel.text = `Floors: ${todayActivity.adjusted.elevationGain ? todayActivity.adjusted.elevationGain : 0} / ${goals.elevationGain}`;

      activeStatsLabel.style.fill = util.goalToColor(todayActivity.adjusted.activeMinutes, goals.activeMinutes);
      activeStatsLabel.text = `Active: ${todayActivity.adjusted.activeMinutes ? todayActivity.adjusted.activeMinutes.toLocaleString() : 0} / ${goals.activeMinutes}`;

      calsStatsLabel.style.fill = util.goalToColor(todayActivity.adjusted.calories, goals.calories);
      calsStatsLabel.text = `Calories: ${todayActivity.adjusted.calories ? todayActivity.adjusted.calories.toLocaleString() : 0} / ${parseInt(goals.calories).toLocaleString()}`;
    }
  }
}
  
function updateScheduleData(){
  if (show == "schedule" && display.on){
    // Schedule View
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
    
    let day = new Date().getDay()
    
    todayDateLabel.text  = "Today";
    todayWeatherImage.href = util.getForecastIcon(weatherData.todayCondition, 
                                                  weatherData.tomorrowDescription);
    todayDescriptionLabel.text = util.shortenText(weatherData.todayDescription);
    todayHighLabel.text = "High:"
    todayHighValLabel.text = weatherData.todayHigh + "°"
    todayLowLabel.text = "Low:"
    todayLowValLabel.text = weatherData.todayLow + "°"
    
    tomorrowDateLabel.text = util.toDay(day+1, "long");
    tomorrowWeatherImage.href = util.getForecastIcon(weatherData.tomorrowCondition, 
                                                     weatherData.tomorrowDescription);
    tomorrowDescriptionLabel.text = util.shortenText(weatherData.tomorrowDescription);
    tomorrowHighLabel.text = "High:"
    tomorrowHighValLabel.text = weatherData.tomorrowHigh + "°"
    tomorrowLowLabel.text = "Low:"
    tomorrowLowValLabel.text = weatherData.tomorrowLow + "°"
    
    day3DateLabel.text = util.toDay(day+2, "long");
    day3WeatherImage.href = util.getForecastIcon(weatherData.day3Condition, 
                                                     weatherData.day3Description);
    day3DescriptionLabel.text = util.shortenText(weatherData.day3Description);
    day3HighLabel.text = "High:"
    day3HighValLabel.text = weatherData.day3High + "°"
    day3LowLabel.text = "Low:"
    day3LowValLabel.text = weatherData.day3Low + "°"
  }
}

//------------------Event Handleing--------------------

background.onclick = function(evt) {
  console.log("Click");
  
  // Views
  let clockView = document.getElementById("clock");
  let periodView = document.getElementById("period");
  let weatherView = document.getElementById("weather");
  let statsView = document.getElementById("stats");
  let scheduleView = document.getElementById("schedule");
  let forecastView = document.getElementById("forecast");

  
  if (show == "clock"){           // In Clock -> Switching to Stats
    show = "stats";
    clockView.style.display = "none";
    periodView.style.display = "none";
    weatherView.style.display = "none";
    scheduleView.style.display = "none";
    forecastView.style.display = "none";
    updateStatsData()
    statsView.style.display = "inline";
    console.log("stats Loaded");
    display.poke()
  } else if (show == "stats"){                   // In Stats -> Switching to forcast or schedule    
    if (inSched){  
      show = "schedule";
      clockView.style.display = "none";
      periodView.style.display = "none";
      weatherView.style.display = "none";
      statsView.style.display = "none";
      forecastView.style.display = "none";
      updateScheduleData();
      scheduleView.style.display = "inline";
      console.log("schedule Loaded");
    } else if(weatherData != null) {
      show = "forecast";
      clockView.style.display = "none";//test
      periodView.style.display = "none";
      weatherView.style.display = "none";//test
      statsView.style.display = "none";
      scheduleView.style.display = "none";
      updateClock();
      updateClockData();
      updateForecastData();
      forecastView.style.display = "inline";//test
      console.log("forecast Loaded");
    } else {
      show = "clock";
      statsView.style.display = "none";
      scheduleView.style.display = "none";
      forecastView.style.display = "none";
      updateClock();
      updateClockData();
      clockView.style.display = "inline";//test
      if (inSched){ 
        updatePeriodData();
        weatherView.style.display = "none";
        periodView.style.display = "inline";
      } else {
        periodView.style.display = "none";
        weatherView.style.display = "inline";//test
      }
      console.log("Clock Loaded");
    } 
  } else {                                  // In Schedule -> Switching to Clock
    show = "clock";
    statsView.style.display = "none";
    scheduleView.style.display = "none";
    forecastView.style.display = "none";
    updateClock();
    updateClockData();
    clockView.style.display = "inline";//test
    if (inSched){ 
      weatherView.style.display = "none";
      updatePeriodData();
      periodView.style.display = "inline";
    } else {
      periodView.style.display = "none";
      weatherView.style.display = "inline";//test
    }
    console.log("Clock Loaded");

  }
}

display.onchange = function() {
  if (display.on) {
    // Views
    let clockView = document.getElementById("clock");
    let periodView = document.getElementById("period");
    let weatherView = document.getElementById("weather");
    let statsView = document.getElementById("stats");
    let scheduleView = document.getElementById("schedule");
    let forecastView = document.getElementById("forecast");
    
    show = "clock";
    statsView.style.display = "none";
    scheduleView.style.display = "none";
    forecastView.style.display = "none";
    hrm.start();
    updateClock();
    updateClockData();
    clockView.style.display = "inline"; //test
    if (inSched){ 
      weatherView.style.display = "none";
      updatePeriodData();
      periodView.style.display = "inline";
    } else {
      periodView.style.display = "none";
      weatherView.style.display = "inline";//test
    }
  } else {
    hrm.stop();
  }
}

//------------------Settings and FS--------------------

function applySettings(){
  setUpdateInterval();
  setLocationUpdateInterval();
  setColor();
  setSchedule();
  setSeperator();
  setDataAge();
  setUnit();
  setWeatherScroll();
  setLocationScroll();
  openedWeatherRequest = false;
}

function setUpdateInterval(oldInterval){
  console.log(`updateInterval is: ${settings.updateInterval}`);
  //let oldInterval = settings.updateInterval;
  if (settings.updateInterval == "5 minutes")
    settings.updateInterval = 5;
  else if (settings.updateInterval == "15 minutes")
    settings.updateInterval = 15;
  else if (settings.updateInterval == "30 minutes")
    settings.updateInterval = 30;
  else if (settings.updateInterval == "1 hour")
    settings.updateInterval = 60;
  else if (settings.updateInterval == "2 hours")
    settings.updateInterval = 120;
  if (settings.updateInterval < oldInterval){
    weather.setMaximumAge(1 * 60 * 1000); 
    if (!openedWeatherRequest){
      console.log("Forcing Update Interval Change");
      openedWeatherRequest = true;
      weather.fetch();
    }
  }
  weather.setMaximumAge(settings.updateInterval * 60 * 1000); 
  if (weatherInterval != null)
    clearInterval(weatherInterval);
  weatherInterval = setInterval(fetchWeather, settings.updateInterval*60*1000);
}

function setLocationUpdateInterval(oldLocationInterval){
  console.log(`locationUpdateInterval is: ${settings.updateLocationInterval}`);
  //let oldLocationInterval = settings.updateLocationInterval;
  if (settings.updateLocationInterval == "5 minutes")
    settings.updateLocationInterval = 5;
  else if (settings.updateLocationInterval == "15 minutes")
    settings.updateLocationInterval = 15;
  else if (settings.updateLocationInterval == "30 minutes")
    settings.updateLocationInterval = 30;
  else if (settings.updateLocationInterval == "1 hour")
    settings.updateLocationInterval = 60;
  else if (settings.updateLocationInterval == "2 hours")
    settings.updateLocationInterval = 120;
  if (settings.updateLocationInterval < oldLocationInterval){
    weather.setMaximumLocationAge(1 * 60 * 1000); 
    if (!openedWeatherRequest){
    console.log("Forcing Location Update Interval Change");
      openedWeatherRequest = true;
      weather.fetch();
    }
  }
  weather.setMaximumLocationAge(settings.updateLocationInterval * 60 * 1000);
}

function setColor(){
  console.log(`Setting Seperator Bar color: ${settings.color}`);
  let seperatorEndLeft = document.getElementById("seperatorEndLeft");
  let seperatorLine = document.getElementById("seperatorLine");
  let seperatorEndRight = document.getElementById("seperatorEndRight");
  
  seperatorEndLeft.style.fill = settings.color;
  seperatorLine.style.fill = settings.color;
  seperatorEndRight.style.fill = settings.color;
}

function setSchedule(){
  console.log(`Schedule is: ${settings.schedule}`);
  
  // Views
  let periodView = document.getElementById("period");
  let weatherView = document.getElementById("weather");
  
  sched = settings.schedule;
  inSched = schedUtils.isInSchedule(sched, time)
  if (inSched && show == "clock"){
    periodView.style.display = "inline";
    weatherView.style.display = "none";
  }else if (!inSched && show == "clock"){
    periodView.style.display = "none";
    weatherView.style.display = "inline";
  }
  updatePeriodData();
}

function setSeperator(){  
  console.log(`seperator: ${settings.sepratorGoal}`);  
  let seperatorEndLeft = document.getElementById("seperatorEndLeft");
  let seperatorLine = document.getElementById("seperatorLine");
  let seperatorEndRight = document.getElementById("seperatorEndRight");
  
  if (inSched && settings.sepratorGoal){
    let scaledNow = schedUtils.timeToMin(time)-schedUtils.timeToMin(schedUtils.getStartofDay(sched))
    let scaledEnd = schedUtils.timeToMin(schedUtils.getEndofDay(sched))-schedUtils.timeToMin(schedUtils.getStartofDay(sched))
    seperatorEndLeft.style.fill = util.goalToColor(scaledNow, scaledEnd);
    seperatorLine.style.fill = util.goalToColor(scaledNow, scaledEnd);
    seperatorEndRight.style.fill = util.goalToColor(scaledNow, scaledEnd);
  } else {
    seperatorEndLeft.style.fill = settings.color;
    seperatorLine.style.fill = settings.color;
    seperatorEndRight.style.fill = settings.color;
  }
}
 
function setDataAge(){
  console.log(`Data Age: ${settings.showDataAge}`);
  
  // Weather View
  let tempAndConditionLabel = document.getElementById("tempAndConditionLabel");
  let weatherLocationLabel = document.getElementById("weatherLocationLabel");
  let weatherImage = document.getElementById("weatherImage");
  
  if (weatherData){
    if (settings.showDataAge){
      let timeStamp = new Date(weatherData.timestamp);
      timeStamp = schedUtils.hourAndMinToTime(timeStamp.getHours(), timeStamp.getMinutes());
      weatherLocationLabel.text = `${weatherData.location} (${timeStamp})`;
    } else {
      weatherLocationLabel.text = `${weatherData.location}`;
    }
  }
}

function setUnit(){
  console.log(`Celsius: ${settings.unitToggle}`);
  
  let tempAndConditionLabel = document.getElementById("tempAndConditionLabel");
  
  let oldUnits = userUnits;
  if (settings.unitToggle)
    userUnits = 'c';
  else 
    userUnits = 'f';
  
  if (weatherData){
    if (oldUnits != userUnits){
      weather.setMaximumAge(0 * 60 * 1000); 
      weather.setUnit(userUnits);
      tempAndConditionLabel.text = `${weatherData.temperature}° ${util.shortenText(weatherData.description)}`;
      if (!openedWeatherRequest){
        console.log("Forcing Update Unit Change");
        openedWeatherRequest = true;
        weather.fetch();
      }
      weather.setMaximumAge(settings.updateInterval * 60 * 1000); 
    }
  }
  weather.setUnit(userUnits);
}
 
function setWeatherScroll(){
  console.log(`Weather Scroll Dissable: ${settings.weatherScrollToggle}`);
  
  // Weather View
  let tempAndConditionLabel = document.getElementById("tempAndConditionLabel");
  let weatherLocationLabel = document.getElementById("weatherLocationLabel");
  let weatherImage = document.getElementById("weatherImage");
  
  if (settings.weatherScrollToggle){
    tempAndConditionLabel.state = "disabled"
    tempAndConditionLabel.text = "";
    if (weatherData)
      tempAndConditionLabel.text = `${weatherData.temperature}° ${util.shortenText(weatherData.description)}`;
    else
      tempAndConditionLabel.text = "Updating..."
  } else
    tempAndConditionLabel.state = "enabled"
}

function setLocationScroll(){
  console.log(`Weather Scroll Dissable: ${settings.locationScrollToggle}`);
  // Weather View
  let tempAndConditionLabel = document.getElementById("tempAndConditionLabel");
  let weatherLocationLabel = document.getElementById("weatherLocationLabel");
  let weatherImage = document.getElementById("weatherImage");
  
  if (settings.locationScrollToggle){
    weatherLocationLabel.state = "disabled"
    weatherLocationLabel.text = "";
    if (weatherData){
      if (settings.dataAgeToggle){
        let timeStamp = new Date(weatherData.timestamp);
        timeStamp = schedUtils.hourAndMinToTime(timeStamp.getHours(), timeStamp.getMinutes());
        weatherLocationLabel.text = `${weatherData.location} (${timeStamp})`;
      } else {
        weatherLocationLabel.text = `${weatherData.location}`;
      }
    }
  }  else
    weatherLocationLabel.state = "enabled"
}

me.onunload = saveSettings;

function loadSettings() {
  console.log("Loading Settings!")
  const SETTINGS_TYPE = "cbor";
  const SETTINGS_FILE = "settings.cbor";
  
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    // Defaults
    return {
      updateInterval : "30 minutes",
      updateLocationInterval : "30 minutes",
      sepratorGoal : false,
      unitToggle : false,
      dataAgeToggle : false,
      showError: false,
      showFailCount : false,
      weatherScrollToggle : false,
      locationScrollToggle : false,
      color : "#004C99",
      schedule : "Regular",
      noFile : true
    }
  }
}

function saveSettings() {
  console.log("Saving Settings");
  
  const SETTINGS_TYPE = "cbor";
  const SETTINGS_FILE = "settings.cbor";
  
  settings.noFile = false;
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}

function fetchWeather(){
  if (!inSched){
    openedWeatherRequest = false;
    console.log("auto fetch");
    weather.fetch();
  }
}

//-----------------Startup------------------------
// Update the clock every tick event
clock.ontick = () => updateClock();
setInterval(updateClockData, 3*1000);

if (periodInterval != null)
    clearInterval(periodInterval);
periodInterval = setInterval(updatePeriodData, 15*1000);

if (weatherInterval != null)
    clearInterval(weatherInterval);
weatherInterval = setInterval(fetchWeather, settings.updateInterval*60*1000);

updateClock();
updateClockData();
updatePeriodData();
hrm.start();
console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
