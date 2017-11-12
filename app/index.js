/*
 * Entry point for the watch app
 */
import clock from "clock";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";


import * as util from "../common/utils";

console.log("Kearsarge Time Started");

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
let clockLabel = document.getElementById("clockLabel");
let dateLabel = document.getElementById("dateLabel");
let hrmData = document.getElementById("hrLabel");

let hrm = new HeartRateSensor();

hrm.start();

function update(){
  updateClock();
  refreshData();
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
  clockLabel.innerText = `${hours}:${mins}`;
}

function refreshData() {
  let data = {
    hrm: {
      heartRate: hrm.heartRate ? hrm.heartRate : 0
    },
    step: {
      steps: today.local.steps ? today.local.steps: 0
    }
  };
  
  console.log(data.hrm);
  console.log(data.step);
  hrmData.innerText = `${data.hrm} bpm`;
}

// Update the clock every tick event
clock.ontick = () => update();

// Don't start with a blank screen
updateClock();

