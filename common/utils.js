// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function toDay(day){
  let dayText = ""
  switch (day){
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
  return dayText
}

export function toMonth(month){
  let monthText = ""
  switch (month){
    case 0:
      monthText = "Jan.";
      break;
    case 1:
      monthText = "Feb.";
      break;
    case 2:
      monthText = "Mar.";
      break;
    case 3:
      monthText = "Apr.";
      break;
    case 4:
      monthText = "May.";
      break;
    case 5:
      monthText = "June";
      break;
    case 6:
      monthText = "July";
      break;
    case 7:
      monthText = "Aug.";
      break;
    case 8:
      monthText = "Sept.";
      break;
    case 9:
      monthText = "Oct.";
      break;
    case 10:
      monthText = "Nov.";
      break;
    case 11:
      monthText = "Dec.";
      break;
  }
  return monthText
}
