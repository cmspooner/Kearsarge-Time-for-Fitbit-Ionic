let months = { 
  0: "Jan.", 
  1: "Feb.", 
  2: "Mar.", 
  3: "Apr.", 
  4: "May", 
  5: "June", 
  6: "July", 
  7: "Aug.", 
  8: "Sept.", 
  9: "Oct.",
  10: "Nov.",
  11: "Dec."
}

let days = { 
  0: "Sun", 
  1: "Mon", 
  2: "Tues", 
  3: "Wed", 
  4: "Thurs", 
  5: "Fri", 
  6: "Sat",
}


// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function toMonth(month) {
  return months[month];
}

export function toDay(day) {
  return days[day];
}

export function goalToColor(value, total){
  if (!value || !total){
    color = '#F83C40'; //fb-red
    return color;
  }
  
  let percent = value/total*100;
  let color = 'white'; // #FFFFFF
  if (percent < 33.33){
    color = 'fb-red'; // #F83C40
  } else if (percent < 66.66){
    color = 'fb-peach'; // #FFCC33
  } else if (percent < 100){
    color = 'fb-cyan';  // #14D3F5
  } else {
    color = 'fb-mint'; // #5BE37D
  }
  return color
}

export function round2(number){
  var factor = Math.pow(10, 2);
  var tempNumber = number * factor;
  var roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
}

export function isInRange(value, low, high){
  return value >= low && value <= high;
}
