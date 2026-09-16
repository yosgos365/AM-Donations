const { HDate, months, gematriya } = require('@hebcal/core');
console.log("Year 5784 (Leap):", new HDate(1, 1, 5784).isLeapYear());
console.log("Months in 5784:", HDate.monthsInYear(5784));
console.log("Days in Elul 5784:", HDate.daysInMonth(6, 5784)); // Elul is month 6? Wait.
