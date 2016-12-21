/*utils.js*/

const bold = 900;

const days = {};
days.long = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
days.short = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
days.number = ['01','02','03','04','05','06','07'];
// console.log('days: ', days);

const months = {};
months.long = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
months.short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
months.number = ['01','02','03','04','05','06','07','08','09','10','11','12'];
// console.log('months: ', months);

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const time = document.querySelectorAll(".time");
time.forEach(function(e){
  // console.log('e: ', e);
  e.innerHTML = "--"
});

/**
 * Lengths of units of time in seconds.
 * 
 * Notes:
 * 
 * - An average year is 365.24225 days (adjusting for leap years/
 * days).
 * 
 * - Therefore an average month is (365.24225/12) or 30.4368541667 
 * days long.
 * 
 * - Using these averages will introduce more margin of error when 
 * comparing dates in the middles of months than dates at the 
 * beginnings or ends of months.
 * 
 */
const units = {
  // "years":(31536000),
  "yrs":(86400*365.24225),
  "mon":(86400*30.4368541667),
  "day":86400,
  "hrs":3600,
  "min":60,
  "sec":1
};

const dateFunctions = {
  "yrs":"getFullYear",
  "mon":"getMonth",
  "day":"getDate",
  "hrs":"getHours",
  "min":"getMinutes",
  "sec":"getSeconds"
};

function timezoneOffset (time, el) {
  console.log('el: ', el.tagName);
  const offset = time.getTimezoneOffset()/60;
  // const el = time;
  let string = '';
  if (offset > 0) {
    string = 'UTC+'+offset;
  } else if (offset < 0) {
    string = 'UTC-'+offset;
  } else {
    string = 'UTC';
  }
  if (el.tagName) {
    if (el.tagName === 'INPUT') {
      el.value = string;
    } else {
      el.innerHTML = string;
    }
  } else {
    console.log('el.tagName error!');
  }
}
