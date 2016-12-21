/* countdown.js */

    /* the below is the only format (date.toISOString()) that input[type="datetime-local"] accepts */
    const defTime = "2018-01-01T06:00:00";
    const defTimeArr = defTime.split("T");
    // console.log('defTimeArr: ', defTimeArr);

    let flagState = '';

    /* cache dome objs */
    const grids = document.querySelectorAll(".grid");
    const msgFuture = document.querySelectorAll(".future");
    const msgPast = document.querySelectorAll(".past");

    const counts = document.querySelectorAll(".count-yrs, .count-mon, .count-day");

    const yrs = document.querySelector(".count-yrs");
    const mon = document.querySelector(".count-mon");
    const day = document.querySelector(".count-day");
    const hrs = document.querySelector(".count-hrs");
    const min = document.querySelector(".count-min");
    const sec = document.querySelector(".count-sec");

    const linkEdit = document.querySelector("#link-edit");

    const elNow = document.querySelector("#now");
    const elNowOffset = document.querySelector("#nowOffset");

    const elThen = document.querySelector("#then");
    const elThenOffset = document.querySelector("#thenOffset");

    const elThenDate2 = document.querySelector("#then-date2");
    const elThenTime2 = document.querySelector("#then-time2");

    elThen.value = defTime;
    // elThenDate2.value = defTimeArr[0];
    // elThenTime2.value = defTimeArr[1];

    // let now = new Date();
    // console.log('now: ', now);

    let then = new Date(defTime);
    console.log('then: ', then);

    timezoneOffset(then, elThenOffset);

    // console.log('then.toDateString(): ', then.toDateString());
    console.log('Date.UTC(then): ', Date.UTC(then));
    console.log('then.toUTCString(): ', then.toUTCString());
    console.log('then.toGMTString(): ', then.toGMTString());
    // console.log('then.toISOString(): ', then.toISOString());
    // console.log('then.toJSON(): ', then.toJSON());
    // console.log('then.toLocaleDateString(): ', then.toLocaleDateString());
    // console.log('then.toLocaleString(): ', then.toLocaleString());
    // console.log('then.toLocaleTimeString(): ', then.toLocaleTimeString());
    // console.log('then.toString(): ', then.toString());
    // console.log('then.toTimeString(): ', then.toTimeString());
    // elThen.innerHTML = then.toISOString();

if (elThen) {
    elThen.addEventListener("change", function(){
      console.log('elThen: ', elThen.value);
      // calculate(elThen.value);
      then = new Date(elThen.value);
      // elThen.innerHTML = then;
      timeUpdate();
    });
}

if (linkEdit) {
    linkEdit.addEventListener("click", function(){
      console.log('linkEdit: ', linkEdit);
      elThen.focus();
    });
}

    /**
     * get current time ("now") and find difference between "now" and "then"
     * @return {[type]}      [description]
     */
    function timeUpdate() {

      const now = new Date();
      // console.log('now: ', now);
      elNow.value = now.toISOString().slice(0, -5);
      // console.log('now: ', now.toISOString().slice(0, -5));
      timezoneOffset(now, elNowOffset);
      const nowTime = now.getTime();
      // console.log('nowTime: ', nowTime);

      // console.log('then: ', then);
      // console.log('then.toString(): ', then.toString());
      const thenTime = then.getTime();
      // console.log('thenTime: ', thenTime);

      const milliseconds = thenTime - nowTime;
      // console.log('milliseconds: ', milliseconds);

      timePrint(thenTime,nowTime);

      msgFuture.forEach(msg => msg.classList.remove('hi'));
      msgPast.forEach(msg => msg.classList.remove('hi'));

      if (milliseconds > 0) {
        // the "then" date is in the future
        console.log('future');
        flagState = 'future';
        msgPast.forEach(msg => msg.classList.add('hi'));
        msgFuture.forEach(msg => msg.classList.remove('hi'));
      } else if (milliseconds < 0) {
        // the "then" date is in the past
        console.log('past');
        flagState = 'past';
        msgPast.forEach(msg => msg.classList.remove('hi'));
        msgFuture.forEach(msg => msg.classList.add('hi'));
      } else {
        // the "then" date is in the present
        console.log('present');
        flagState = 'present';
      }

      // timeDiff(milliseconds);

    };

    function timePrint (then,now) {
      console.group('START timePrint');

      const seconds = Math.abs(then-now)/1000;
      console.log('seconds: ', seconds);

      let temp = Math.floor(seconds);
      console.log('temp: ', temp);

      // units.forEach(unit => console.log('JDS -- unit: ', unit));

      for (var i = 0; i < Object.keys(units).length; i++) {
      // for (var i = Object.keys(units).length - 1; i >= 0; i--) {
        console.group('JDS -- Object.keys(units)[i]: ', Object.keys(units)[i]);

        var r = i-1;
        let result = 0;
        const iKey = Object.keys(units)[i];
        console.log('iKey el: ',document.querySelector('.count-'+iKey));
        const rKey = Object.keys(units)[r];

        if (iKey==='yrs') {
          console.log('JDS -- YEARS // temp: ', temp);
          // console.log('JDS -- years // units[iKey]: ', units[iKey]);
          result = Math.floor(temp / units[iKey]);
        } else if (iKey==='sec') {
          console.log('JDS -- SECONDS // temp: ', temp);
          // console.log('JDS -- seconds // units[iKey]: ', units[iKey]);
          result = Math.floor(temp % units[rKey]);
        } else {
          console.log('JDS -- '+iKey+' // temp: ', temp);
          // console.log('JDS -- '+iKey+' // units[iKey]: ', units[iKey]);
          result = Math.floor((temp %= units[rKey]) / (units[iKey]));
        }
        let method = dateFunctions[iKey];
        console.log('test', new Date()[method]());

        if (method==='getMonth') {
          document.querySelector('.now-'+iKey).innerHTML = pad(new Date(now)[method]()+1, 2);
          document.querySelector('.then-'+iKey).innerHTML = pad(new Date(then)[method]()+1, 2);
        } else {
          document.querySelector('.now-'+iKey).innerHTML = pad(new Date(now)[method](), 2);
          document.querySelector('.then-'+iKey).innerHTML = pad(new Date(then)[method](), 2);
        }

        // document.querySelector('.count-'+iKey).innerHTML = pad(result, 2);
        document.querySelector('.delta-'+iKey).innerHTML = pad(result, 2);
        document.querySelector('.count-'+iKey).innerHTML = pad(result, 2);
        console.log('JDS -- result: ', result+' '+iKey);
        console.groupEnd();
      }

      hideZeroes(counts);

      console.groupEnd();

    };

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

    function hideZeroes (things) {
      things.forEach(thing => {if (thing.innerHTML === '00') {thing.style.display = 'none'} else {thing.style.display = 'inline'}});
    }

    timeUpdate();
    setInterval(timeUpdate, 1000);

    grids.forEach(grid => grid.style.display = 'none');
