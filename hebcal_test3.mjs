import { HDate, months } from '@hebcal/core';
const hd = new HDate(1, 1, 5784);
console.log(hd.isLeapYear());
console.log(hd.getMonthName());
// Let's print all months in a leap year
const leapMonths = [];
for(let m = 1; m <= 13; m++) {
  leapMonths.push(new HDate(1, m, 5784).getMonthName());
}
console.log("Leap:", leapMonths);

const nonLeapMonths = [];
for(let m = 1; m <= 12; m++) {
  nonLeapMonths.push(new HDate(1, m, 5783).getMonthName());
}
console.log("Non Leap:", nonLeapMonths);
