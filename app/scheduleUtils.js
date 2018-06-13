import * as util from "../common/utils";

import * as sched from "schedule.js";

export function timeToMin(time){
  let splitTime = time.split(":");
  let hours = parseInt(splitTime[0]);
  let minutes = parseInt(splitTime[1].substring(0,2));
  let ampm = splitTime[1].substring(2);
  
  if (ampm == "p" && hours != 12){
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
  } else if (hours == 12){
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
	//let min1 = timeToMin(time1);
	//let min2 = timeToMin(time2);
	
	return Math.abs(timeToMin(time2) - timeToMin(time1));
}

export function getDailySchedule(typeOfDay){
  if (typeOfDay == "Regular"){
    let today = new Date();
    let day = today.getDay();
    typeOfDay = sched.dayToSchedule[day];
  }
  return sched.schedule(typeOfDay);
}

export function isInSchedule(typeOfDay, time){
  return util.isInRange(timeToMin(time), getStartofDay(typeOfDay), getEndofDay(typeOfDay));
}

export function getStartofDay(typeOfDay){
  //let todaySched = getDailySchedule(typeOfDay);
  //console.log(todaySched);
  return getDailySchedule(typeOfDay)[0].start;
}

export function getEndofDay(typeOfDay){
  let todaySched = getDailySchedule(typeOfDay);
  return todaySched[todaySched.length-1].end;
}

export function getLastPeriodofDay(typeOfDay){
  let todaySched = getDailySchedule(typeOfDay);
  return todaySched[todaySched.length-2].end;
}


export function getCurrentPeriod(typeOfDay, time){
  let todaySched = getDailySchedule(typeOfDay);
  
  if (isInSchedule(typeOfDay, time)){
    for (let i = 0; i < todaySched.length; i++){
      if (timeToMin(time) < todaySched[i].end){
        return todaySched[i].name;
      }
    }
  } else {
    return "No School";
  }
}

export function getTimeLeftInPeriod(typeOfDay, time){
  //let min = timeToMin(time);
  let todaySched = getDailySchedule(typeOfDay);
  
  //console.log(`getTimeLeftInPeriod is: ${typeOfDay}`);

  if (isInSchedule(typeOfDay, time)){
    for (let i = 0; i < todaySched.length; i++){
      if (timeToMin(time) < todaySched[i].end){
        return todaySched[i].end - timeToMin(time);
      }
    }
  } else {
    return 0;
  }
}

export function getPeriodList(typeOfDay){
  //let todaySched = getDailySchedule(typeOfDay);
  //let periods = getDailySchedule(typeOfDay).filter(x => sched.ignoredPeriods.indexOf(x.name) === -1);
  
  return getDailySchedule(typeOfDay).filter(x => sched.ignoredPeriods.indexOf(x.name) === -1);
}