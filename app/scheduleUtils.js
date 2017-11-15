import * as util from "../common/utils";

import * as sched from "schedule.js";

export function timeToMin(time){
  let splitTime = time.split(":");
  let hours = parseInt(splitTime[0]);
  let minutes = parseInt(splitTime[1].substring(0,2));
  let ampm = splitTime[1].substring(2);
  
  if (ampm == "p"){
	  hours += 12;
  } else if (ampm == "a" && hours == 12){
    hours -= 12;
  }
  
  minutes += hours * 60;
  
  //console.log(minutes);
  return minutes;
}

export function minToTime(min){
  let hours = parseInt(min/60);
  let mins = parseInt(min%60);
  let ampm = "a";
  
  if (hours > 12){
  	hours -= 12;
    ampm = "p";
  } else if (hours == 0){
  	hours += 12;
  }
    
  let time = hours + ":" + util.zeroPad(mins) + ampm
  
  //console.log(time);
  return time;
}

//useing pre-converted 24 hour time
export function hourAndMinToMin(hour, min){
  return hour*60 + min;
}

//useing pre-converted 24 hour time
export function hourAndMinToTime(hour, min){
  return minToTime(hourAndMinToMin(hour, min));
}

export function timeDiff(time1, time2){
	let min1 = timeToMin(time1);
	let min2 = timeToMin(time2);
	
	return Math.abs(min2 - min1);
}

export function getDailySchedule(typeOfDay){
  if (typeOfDay == "Regular"){
    let today = new Date();
    let day = today.getDay();
    let days = {
      0: "No School",
      1: "MF",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "MF",
      6: "No School"
    }
    typeOfDay = days[day];
  }
  return sched.schedule[typeOfDay];
}

export function isInSchedule(typeOfDay, time){
  let min = timeToMin(time);
  let todaySched = getDailySchedule(typeOfDay);
  let start = timeToMin(todaySched[0].start);
  let end = timeToMin(todaySched[todaySched.length-1].end);
  
  return util.isInRange(min, start, end);
}

export function getCurrentPeriod(typeOfDay, time){
  let min = timeToMin(time);
  let todaySched = getDailySchedule(typeOfDay);
  let start = timeToMin(todaySched[0].start);
  
  if (isInSchedule(typeOfDay, time)){
    for (let i = 0; i < todaySched.length-1; i++){
      if (min < timeToMin(todaySched[i].end)){
        return todaySched[i].name;
      }
    }
  } else {
    return "No School";
  }
}

export function getTimeLeftInPeriod(typeOfDay, time){
  let min = timeToMin(time);
  let todaySched = getDailySchedule(typeOfDay);
  let start = timeToMin(todaySched[0].start);
  
  if (isInSchedule(typeOfDay, time)){
    for (let i = 0; i < todaySched.length-1; i++){
      if (min < timeToMin(todaySched[i].end)){
        return timeToMin(todaySched[i].end) - min;
      }
    }
  } else {
    return 0;
  }
}

export function getPeriodList(typeOfDay){
  let ignoredPeriods = ["No School",
                      "Before School",
                      "Warning Bell",
                      "Passing Time",
                      "Teacher Time"
                     ];
  let todaySched = getDailySchedule(typeOfDay);
  let periods = todaySched.filter(x => ignoredPeriods.indexOf(x.name) === -1);
  
  return periods
}