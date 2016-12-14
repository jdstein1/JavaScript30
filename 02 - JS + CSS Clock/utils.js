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

const units = {
  "years":31536000,
  // "months":(31536000/12),
  "months":(86400*30.4167),
  "days":86400,
  "hours":3600,
  "minutes":60,
  "seconds":1
}