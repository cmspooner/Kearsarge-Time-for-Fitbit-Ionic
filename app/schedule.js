export const dayToSchedule = {
    "Sunday": "No School",
    "Monday": "Normal",
    "Tuesday": "Normal",
    "Wednesday": "Normal",
    "Thursday": "Normal",
    "Friday": "Normal",
    "Saturday": "No School"
}

export const ignoredPeriods= [
          "No School",
          "Before School",
          "Warning Bell",
          "Passing Time",
          "Teacher Time"
];


export const splitPeriods={
      "Period 5": [
              "Period 5, 1st Wave",
              "Period 5, 2nd Wave",
              "Period 5, 3rd Wave"
       ]
}

export function schedule(typeOfDay){
  switch (typeOfDay) {
   case "No School" :
      return [
          {name: "No School", start: "12:00a", end: "12:00a"}
         ];
      break;
    case "Normal": 
      return [
           {name: "Before School", start: 395, end: 455},
           {name: "Warning Bell", start: 455, end: 460},
           {name: "Period 1", start: 460, end: 505},
           {name: "Passing Time", start: 505, end: 509},
           {name: "Period 2", start: 509, end: 557}, 
           {name: "Passing Time", start: 557, end: 561},
           {name: "Period 3", start: 561, end: 606},
           {name: "Passing Time", start: 606, end: 610},
           {name: "Period 4", start: 610, end: 655}, 
           {name: "Passing Time", start: 655, end: 659},
           {name: "Period 5, 1st Wave", start: 659, end: 681},
           {name: "Period 5, 2nd Wave", start: 681, end: 707},
           {name: "Period 5, 3rd Wave", start: 707, end: 733},
           {name: "Passing Time", start: 733, end: 737},
           {name: "Period 6", start: 737, end: 782},
           {name: "Passing Time", start: 782, end: 786},
           {name: "Period 7", start: 786, end: 831},
           {name: "Passing Time", start: 831, end: 835},
           {name: "Period 8", start: 835, end: 875},
           {name: "Teacher Time", start: 875, end: 915}
          ];
      break;
    case "2 Hour Delay": 
      return [
           {name: "Before School", start: 515, end: 575}, 
           {name: "Warning Bell", start: 575, end: 580},
           {name: "Period 1", start: 580, end: 612},
           {name: "Passing Time", start: 612, end: 616},
           {name: "Period 2", start: 616, end: 650}, 
           {name: "Passing Time", start: 650, end: 654},
           {name: "Period 3", start: 654, end: 686},
           {name: "Passing Time", start: 686, end: 690},
           {name: "Period 4", start: 690, end: 722}, 
           {name: "Passing Time", start: 722, end: 726},
           {name: "Period 5, 1st Wave", start: 726, end: 748},
           {name: "Period 5, 2nd Wave", start: 748, end: 774},
           {name: "Period 5, 3rd Wave", start: 774, end: 800},
           {name: "Passing Time", start: 800, end: 804},
           {name: "Period 6", start: 804, end: 836},
           {name: "Passing Time", start: 836, end: 840},
           {name: "Period 7", start: 840, end: 875},
           {name: "Teacher Time", start: 875, end: 915}
          ];
      break;
   case "PM Activity": 
      return [
           {name: "Before School", start: 395, end: 455}, 
           {name: "Warning Bell", start: 455, end: 460},
           {name: "Period 1", start: 460, end: 500},
           {name: "Passing Time", start: 500, end: 504},
           {name: "Period 2", start: 504, end: 547}, 
           {name: "Passing Time", start: 547, end: 551},
           {name: "Period 3", start: 551, end: 591},
           {name: "Passing Time", start: 591, end: 595},
           {name: "Period 4", start: 595, end: 635}, 
           {name: "Passing Time", start: 635, end: 639},
           {name: "Period 5, 1st Wave", start: 639, end: 661},
           {name: "Period 5, 2nd Wave", start: 661, end: 687},
           {name: "Period 5, 3rd Wave", start: 687, end: 713},
           {name: "Passing Time", start: 713, end: 717},
           {name: "Period 6", start: 717, end: 757},
           {name: "Passing Time", start: 757, end: 761},
           {name: "Period 7", start: 761, end: 801},
           {name: "Passing Time", start: 801, end: 805},
           {name: "PM Activity", start: 805, end: 875},
           {name: "Teacher Time", start: 875, end: 915}
          ];
      break;
    case "Assembly":
      return [
           {name: "Before School", start: 395, end: 455},
           {name: "Warning Bell", start: 455, end: 460},
           {name: "Period 1", start: 460, end: 505},
           {name: "Passing Time", start: 505, end: 509},
           {name: "Period 2", start: 509, end: 557}, 
           {name: "Passing Time", start: 557, end: 561},
           {name: "Period 3", start: 561, end: 606},
           {name: "Passing Time", start: 606, end: 610},
           {name: "Assembly", start: 610, end: 650},
           {name: "Passing Time", start: 650, end: 654},
           {name: "Period 5, 1st Wave", start: 654, end: 676},
           {name: "Period 5, 2nd Wave", start: 676, end: 702},
           {name: "Period 5, 3rd Wave", start: 702, end: 728},
           {name: "Passing Time", start: 728, end: 732},
           {name: "Period 4", start: 732, end: 777},
           {name: "Passing Time", start: 777, end: 781},
           {name: "Period 6", start: 781, end: 826},
           {name: "Passing Time", start: 826, end: 830},
           {name: "Period 7", start: 830, end: 875},
           {name: "Teacher Time", start: 875, end: 915}
          ];
      break;
    case "7 Period": 
      return [
           {name: "Before School", start: 395, end: 455},
           {name: "Warning Bell", start: 455, end: 460},
           {name: "Period 1", start: 460, end: 512},
           {name: "Passing Time", start: 512, end: 516},
           {name: "Period 2", start: 516, end: 571}, 
           {name: "Passing Time", start: 571, end: 575},
           {name: "Period 3", start: 575, end: 627},
           {name: "Passing Time", start: 627, end: 631},
           {name: "Period 4", start: 631, end: 683},
           {name: "Passing Time", start: 683, end: 687},
           {name: "Period 5, 1st Wave", start: 687, end: 712},
           {name: "Period 5, 2nd Wave", start: 712, end: 738},
           {name: "Period 5, 3rd Wave", start: 738, end: 764},
           {name: "Passing Time", start: 764, end: 768},
           {name: "Period 6", start: 768, end: 820},
           {name: "Passing Time", start: 820, end: 824},
           {name: "Period 7", start: 824, end: 875},
           {name: "Teacher Time", start: 875, end: 915}
          ];
      break;
    case "Exam": 
      return [
           {name: "Before School", start: 395, end: 450},
           {name: "Before Exam 1", start: 450, end: 480},
           {name: "Exam 1", start: 480, end: 570},
           {name: "Passing Time", start: 570, end: 600},
           {name: "Exam 2", start: 600, end: 690}, 
           {name: "Lunch", start: 690, end: 765},
           {name: "Make-Up", start: 765, end: 855},
           {name: "Teacher Time", start: 855, end: 915}
          ];
      break;
  }
}