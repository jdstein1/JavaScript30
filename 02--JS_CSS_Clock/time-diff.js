function timeDiff (time) {

  var seconds = Math.abs(time)/1000;
  console.log('seconds: ', seconds);

  // function numberEnding (number) {
  //     return (number > 1) ? 's' : '';
  // }

  var temp = Math.floor(seconds);
  // console.log('temp: ', temp);

  var numYears = Math.floor(temp / units.years);
  // console.log('numYears: ', numYears);
  yrs.innerHTML = pad(numYears, 2);

  //TODO: Months! Maybe weeks? 
  var numMonths = Math.floor((temp %= units.years) / units.months);
  // console.log('numMonths: ', numMonths);
  mon.innerHTML = pad(numMonths, 2);

  var numDays = Math.floor((temp %= units.months) / units.days);
  // console.log('numDays: ', numDays);
  day.innerHTML = pad(numDays, 2);

  var numHours = Math.floor((temp %= units.days) / units.hours);
  // console.log('numHours: ', numHours);
  hrs.innerHTML = pad(numHours, 2);

  var numMinutes = Math.floor((temp %= units.hours) / units.minutes);
  // console.log('numMinutes: ', numMinutes);
  min.innerHTML = pad(numMinutes, 2);

  var numSeconds = Math.floor(temp % units.minutes);
  // console.log('numSeconds: ', numSeconds);
  sec.innerHTML = pad(numSeconds, 2);

  hideZeroes(counts);

  // console.log( numYears + " years " + numMonths + " Months " + numDays + " days " + numHours + " hours " + numMinutes + " minutes " + numSeconds + " seconds" );

};
