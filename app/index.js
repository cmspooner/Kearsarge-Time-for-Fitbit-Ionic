'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clock = _interopDefault(require('clock'));
var document = _interopDefault(require('document'));
var heartRate = require('heart-rate');
var userActivity = require('user-activity');
var userProfile = require('user-profile');
var display = require('display');

function zeroPad(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function toDay(day) {
    var dayText = "";
    switch (day) {
        case 0:
            dayText = "Sun";
            break;
        case 1:
            dayText = "Mon";
            break;
        case 2:
            dayText = "Tues";
            break;
        case 3:
            dayText = "Wed";
            break;
        case 4:
            dayText = "Thurs";
            break;
        case 5:
            dayText = "Fri";
            break;
        case 6:
            dayText = "Sat";
            break;
    }
    return dayText;
}
function toMonth(month) {
    var monthText = "";
    switch (month) {
        case 1:
            monthText = "Jan.";
            break;
        case 2:
            monthText = "Feb.";
            break;
        case 3:
            monthText = "Mar.";
            break;
        case 4:
            monthText = "Apr.";
            break;
        case 5:
            monthText = "May.";
            break;
        case 6:
            monthText = "June";
            break;
        case 7:
            monthText = "July";
            break;
        case 8:
            monthText = "Aug.";
            break;
        case 9:
            monthText = "Sept.";
            break;
        case 10:
            monthText = "Oct.";
            break;
        case 11:
            monthText = "Nov.";
            break;
        case 12:
            monthText = "Dec.";
            break;
    }
    return monthText;
}
function goalToColor(value, total) {
    if (!value || !total) {
        color = '#F83C40';
        return color;
    }
    var percent = value / total * 100;
    var color = '#FFFFFF';
    if (percent < 33.33) {
        color = '#F83C40';
    }
    else if (percent < 66.66) {
        color = '#FFCC33';
    }
    else if (percent < 100) {
        color = '#14D3F5';
    }
    else {
        color = '#5BE37D';
    }
    return color;
}
function round2(number) {
    var factor = Math.pow(10, 2);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
}

console.log("Kearsarge Time Started");
clock.granularity = "minutes";
var background = document.getElementById("clickbg");
var clockView = document.getElementById("clock");
var statsView = document.getElementById("stats");
var clockLabel = document.getElementById("clockLabel");
var dateLabel = document.getElementById("dateLabel");
var hrLabel = document.getElementById("hrLabel");
var stepsLabel = document.getElementById("stepsLabel");
var stepStatsLabel = document.getElementById("stepStatsLabel");
var distStatsLabel = document.getElementById("distStatsLabel");
var floorsStatsLabel = document.getElementById("floorsStatsLabel");
var activeStatsLabel = document.getElementById("activeStatsLabel");
var calsStatsLabel = document.getElementById("calsStatsLabel");
var hrm = new heartRate.HeartRateSensor();
hrm.start();
function updateClock() {
    var today$$1 = new Date();
    var date = today$$1.getDate();
    var day = today$$1.getDay();
    var month = today$$1.getMonth() + 1;
    var year = today$$1.getYear() - 100 + 2000;
    var hours = today$$1.getHours();
    var mins = zeroPad(today$$1.getMinutes());
    if (hours > 12) {
        var ampm = "pm";
        hours -= 12;
    }
    else {
        var ampm = "am";
    }
    dateLabel.text = toDay(day) + ", " + toMonth(month) + " " + date;
    clockLabel.text = hours + ":" + mins + " " + ampm;
}
function updateClockData() {
    var data = {
        heart: {
            theHeartRate: hrm.heartRate ? hrm.heartRate : 0
        },
        step: {
            steps: userActivity.today.local.steps ? userActivity.today.local.steps : 0
        }
    };
    console.log("Data:");
    console.log(data.heart.theHeartRate);
    console.log(data.step.steps.toLocaleString());
    hrLabel.style.fill = 'white';
    stepsLabel.style.fill = 'white';
    if (data.heart.theHeartRate == 0) {
        hrLabel.text = "--";
    }
    else {
        if (userProfile.user.heartRateZone(data.heart.theHeartRate) == "out-of-range") {
            hrLabel.style.fill = '#14D3F5';
        }
        else if (userProfile.user.heartRateZone(data.heart.theHeartRate) == "fat-burn") {
            hrLabel.style.fill = '#5BE37D';
        }
        else if (userProfile.user.heartRateZone(data.heart.theHeartRate) == "cardio") {
            hrLabel.style.fill = '#FFCC33';
        }
        else if (userProfile.user.heartRateZone(data.heart.theHeartRate) == "peak") {
            hrLabel.style.fill = '#F83C40';
        }
        hrLabel.text = data.heart.theHeartRate + " bpm";
    }
    stepsLabel.style.fill = goalToColor(data.step.steps, userActivity.goals.steps);
    stepsLabel.text = data.step.steps.toLocaleString() + " steps";
}
function updateStatsData() {
    stepStatsLabel.style.fill = goalToColor(userActivity.today.local.steps, userActivity.goals.steps);
    stepStatsLabel.text = "Steps: " + (userActivity.today.local.steps ? userActivity.today.local.steps.toLocaleString() : 0) + " / " + userActivity.goals.steps.toLocaleString();
    distStatsLabel.style.fill = goalToColor(userActivity.today.local.distance, userActivity.goals.distance);
    distStatsLabel.text = "Distance: " + (userActivity.today.local.distance ? round2(userActivity.today.local.distance * 0.000621371) : 0) + " / " + round2(userActivity.goals.distance * 0.000621371);
    floorsStatsLabel.style.fill = goalToColor(userActivity.today.local.elevationGain, userActivity.goals.elevationGain / 10);
    floorsStatsLabel.text = "Floors: " + (userActivity.today.local.elevationGain ? userActivity.today.local.elevationGain : 0) + " / " + userActivity.goals.elevationGain / 10;
    activeStatsLabel.style.fill = goalToColor(userActivity.today.local.activeMinutes, userActivity.goals.activeMinutes);
    activeStatsLabel.text = "Active: " + (userActivity.today.local.activeMinutes ? userActivity.today.local.activeMinutes.toLocaleString() : 0) + " / " + userActivity.goals.activeMinutes;
    calsStatsLabel.style.fill = goalToColor(userActivity.today.local.calories, userActivity.goals.calories / 6.8);
    calsStatsLabel.text = "Calories: " + (userActivity.today.local.calories ? userActivity.today.local.calories.toLocaleString() : 0) + " / " + parseInt(userActivity.goals.calories / 6.8).toLocaleString();
}
var showClock = true;
background.onclick = function (evt) {
    console.log("Click");
    if (showClock) {
        showClock = false;
        updateStatsData();
        clockView.style.display = "none";
        statsView.style.display = "inline";
        display.display.poke();
    }
    else {
        showClock = true;
        updateClock();
        updateClockData();
        clockView.style.display = "inline";
        statsView.style.display = "none";
    }
    console.log("ShowClock is " + showClock);
};
display.display.onchange = function () {
    if (!display.display.on) {
        showClock = true;
        updateClock();
        updateClockData();
        clockView.style.display = "inline";
        statsView.style.display = "none";
    }
};
clock.ontick = function () { return updateClock(); };
setInterval(updateClockData, 3000);
setInterval(updateStatsData, 3000);
updateClock();
updateClockData();
