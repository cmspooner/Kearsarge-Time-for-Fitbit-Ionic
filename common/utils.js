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
  return monthText
}

export function goalToColor(value, total){
  let percent = value/total*100;
  let color = '#FFFFFF';
  if (percent < 33.33){
    color = '#F83C40'; //fb-red
  } else if (percent < 66.66){
    color = '#FC6B3A'; //fb-orange
  } else if (percent < 100){
    color = '#14D3F5';  //fb-cyan
  } else {
    color = '#5BE37D'; //fb-mint
  }
  return color
}
