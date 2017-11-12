/*
 * Entry point for the watch app
 */
import clock from "clock";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";
import { goals } from "user-activity";
import { user } from "user-profile";

import * as util from "../common/utils";

console.log("Kearsarge Time Started");

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
let clockLabel = document.getElementById("clockLabel");
let dateLabel = document.getElementById("dateLabel");
let hrLabel = document.getElementById("hrLabel");
let stepsLabel = document.getElementById("stepsLabel");

let hrm = new HeartRateSensor();

hrm.start();

function update(){
  updateClock();
  updateData();
}

// Update the <text> element with the current time
function updateClock() {
  let today = new Date();
  let date = today.getDate();
  let day = today.getDay();
  let month = today.getMonth()+1;
  let year = today.getYear()-100+2000;
  let hours = today.getHours();
  let mins = util.zeroPad(today.getMinutes());
  if (hours> 12){
    let ampm = "pm";
    hours -= 12;
  } else {
    let ampm = "am";
  }

  dateLabel.innerText = `${util.toDay(day)}, ${util.toMonth(month)} ${date}`;
  clockLabel.innerText = `${hours}:${mins} ${ampm}`;
}

function updateData() {
  let data = {
    heart: {
      theHeartRate: hrm.heartRate ? hrm.heartRate : 0
    },
    step: {
      steps: today.local.steps ? today.local.steps: 0
    }
  };
  
  console.log("Data:");
  console.log(data.heart.theHeartRate);
  console.log(data.step.steps.toLocaleString());
  
  hrLabel.style.fill = 'white';
  stepsLabel.style.fill = 'white';
  
  if (data.heart.theHeartRate == 0) {
      hrLabel.innerText = `--`;
  } else {
      if (user.heartRateZone(data.heart.theHeartRate) == "out-of-range"){
        hrLabel.style.fill = '#14D3F5';  //fb-cyan
      } else if (user.heartRateZone(data.heart.theHeartRate) == "fat-burn"){
        hrLabel.style.fill = '#5BE37D'; //fb-mint
      } else if (user.heartRateZone(data.heart.theHeartRate) == "cardio"){
        hrLabel.style.fill = '#FC6B3A'; //fb-orange
      } else if (user.heartRateZone(data.heart.theHeartRate) == "peak"){
        hrLabel.style.fill = '#F83C40'; //fb-red
      }
    
      hrLabel.innerText = `${data.heart.theHeartRate} bpm`;
  }
  
  stepsLabel.style.fill = util.goalToColor(data.step.steps, goals.steps);
  
  stepsLabel.innerText = `${data.step.steps.toLocaleString()} steps`;
  
}

// Update the clock every tick event
clock.ontick = () => update();

// Don't start with a blank screen
update();

