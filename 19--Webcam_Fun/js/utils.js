/* utils.js */
console.log('utils.js READY!');

/* toggle button enable/disable */
function toggleButton(el,state) {
  if (state) {
    switch(state) {
      case 'off':
        el.classList.add('disabled');
        el.disabled = true;
        break;
      case 'on':
        el.classList.remove('disabled');
        el.disabled = false;
        break;
    }
  } else {
    el.disabled = !el.disabled;
    el.classList.toggle('disabled');
  }
}

/* hide element by adding "hide" class */
function hide(el) {
  if (el.length > 1) {
    for (var i = 0; i < el.length; i++) {
      el[i].classList.add('hide');
    }
  } else {
    el.classList.add('hide');
  }
}

/* show element by removing "hide" class */
function show(el) {
  if (el.length > 1) {
    for (var i = 0; i < el.length; i++) {
      el[i].classList.remove('hide');
    }
  } else {
    el.classList.remove('hide');
  }
}
