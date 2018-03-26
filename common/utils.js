let months = [
  "Jan.", 
  "Feb.", 
  "Mar.", 
  "Apr.", 
  "May", 
  "June", 
  "July", 
  "Aug.", 
  "Sept.", 
  "Oct.",
  "Nov.",
  "Dec.",
  
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

let days = [ 
  "Sun", 
  "Mon", 
  "Tues", 
  "Wed", 
  "Thurs", 
  "Fri", 
  "Sat",
  
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]


// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function toMonth(month, len = "short") {
  if (len == "long"){
    month += 12;
  }
  return months[month];
}

export function toDay(day, len = "short") {
  if (len == "long"){
    day += 7;
  }
  return days[day];
}

export function goalToColor(value, total, low = 'fb-red', 
                                          medium = 'fb-peach', 
                                          high = 'fb-cyan', 
                                          complete = 'fb-mint', ){
  if (!value || !total){
    color = low;
    return color;
  }
  
  let percent = value/total*100;
  let color = 'white'; // #FFFFFF
  if (percent < 33.33){
    color = low; // #F83C40
  } else if (percent < 66.66){
    color = medium; // #FFCC33
  } else if (percent < 100){
    color = high;  // #14D3F5
  } else {
    color = complete; // #5BE37D
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
  return value >= low && value < high;
}

export function shortenText(text){
  text = text.replace("and", "&");
  text = text.replace("Mixed ", "");
  text = text.replace("Severe", "Bad");
  text = text.replace("Thunderstorms", "T-Storms");
  text = text.replace("Thundershowers", "T-Showers");
  text = text.replace("Showers", "");
  text = text.replace("Isolated", "Some");
  text = text.replace("Scattered", "Some");
  return text;
  
}