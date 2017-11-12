import * as util from "../common/utils";

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
  
  console.log(minutes);
  return minutes;
}

function minToTime(min){
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
  
  console.log(time);
  return time
}

export function timeDiff(time1, time2){
	let min1 = timeToMin(time1);
	let min2 = timeToMin(time2);
	
	let diff = 0;
	if (min2 > min1){
		diff = min2 - min1;
	} else {
		diff = min1 - min2
	}
	
	return diff
}