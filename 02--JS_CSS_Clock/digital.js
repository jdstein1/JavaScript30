
let dayType = "long";
let monthType = "short";

const day = document.querySelector(".time-day");
day.style.fontWeight = bold;
const yrs = document.querySelector(".time-yrs");
const mon = document.querySelector(".time-mon");
const dat = document.querySelector(".time-dat");
const hrs = document.querySelector(".time-hrs");
const min = document.querySelector(".time-min");
const sec = document.querySelector(".time-sec");

const elOffset = document.querySelector("#nowOffset");


function updateTime(type) {

  const now = new Date();
  // console.log('now: ', now);

  timezoneOffset(now, elOffset);

  const nowDay = days[dayType][now.getDay()];
  // console.log('nowDay: ', nowDay);
  switch(dayType) {
    case 'number':
      day.innerHTML = pad(nowDay, 2);
      break;
    default:
      day.innerHTML = nowDay;
      break;
  }

  const nowYrs = now.getFullYear();
  // console.log('nowYrs: ', nowYrs);
  yrs.innerHTML = pad(nowYrs, 4);

  const nowMon = months[monthType][now.getMonth()];
  // console.log('nowMon: ', nowMon);
  switch(monthType) {
    case 'number':
      mon.innerHTML = pad(nowMon, 2);
      break;
    default:
      mon.innerHTML = nowMon;
      break;
  }

  const nowDat = now.getDate();
  // console.log('nowDat: ', nowDat);
  dat.innerHTML = pad(nowDat, 2);

  const nowHrs = now.getHours();
  // console.log('nowHrs: ', nowHrs);
  hrs.innerHTML = pad(nowHrs, 2);

  const nowMin = now.getMinutes();
  // console.log('nowMin: ', nowMin);
  min.innerHTML = pad(nowMin, 2);

  const nowSec = now.getSeconds();
  // console.log('nowSec: ', nowSec);
  sec.innerHTML = pad(nowSec, 2);

};

setInterval(updateTime, 1000);

