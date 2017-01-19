/* utils.js */
console.log('utils.js READY!');

// toggle button enable/disable
function toggleButton(btn,state) {
  if (state) {
    switch(state) {
      case 'off':
        btn.disabled = true;
        btn.classList.add('disabled');
        break;
      case 'on':
        btn.disabled = false;
        btn.classList.remove('disabled');
        break;
    }
  } else {
    btn.disabled = !btn.disabled;
    btn.classList.toggle('disabled');
  }
}

// toggle display
function toggleDisplay(el,state) {
  // console.log('el: ', el);
  // console.log('el: ', el.length);
  if (el.length > 1) {
    for (var i = 0; i < el.length; i++) {
      el[i].classList.toggle('hide');
    }
  } else {
    el.classList.toggle('hide');
  }
}

// toggle display
function hide(el) {
  console.log('before el: ', el);
  // el = Array.from(el);
  console.log('after el: ', el);
  if (el.length > 1) {
    for (var i = 0; i < el.length; i++) {
      el[i].classList.add('hide');
    }
  } else {
    el.classList.add('hide');
  }
}

// toggle display
function show(el) {
  console.log('before el: ', el);
  // el = Array.from(el);
  console.log('after el: ', el);
  if (el.length > 1) {
    for (var i = 0; i < el.length; i++) {
      el[i].classList.remove('hide');
    }
  } else {
    el.classList.remove('hide');
  }
}

