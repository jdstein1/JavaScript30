/* utils.js */
console.log('utils.js READY!');

if (!Uint8Array.prototype.slice) {
  Object.defineProperty(Uint8Array.prototype, 'slice', {
    value: Array.prototype.slice
  });
}

/* toggle button enable/disable */
function toggleButton(el,state) {
  // console.dir(el);
  if (el.nodeName === 'SELECT') {
    el.selectedIndex = 0
  }
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
function hide(el,exception) {
  // console.dir(el);
  if (el.length > 1) {
    for (var i = 0; i < el.length; i++) {
      el[i].classList.add('hide');
    }
  } else {
    el.classList.add('hide');
  }
  if (exception) {
    exception.classList.remove('hide');
  }
}

/* show element by removing "hide" class */
function show(el,exception) {
  // console.dir(el);
  if (el.length > 1) {
    for (var i = 0; i < el.length; i++) {
      el[i].classList.remove('hide');
    }
  } else {
    el.classList.remove('hide');
  }
  if (exception) {
    exception.classList.add('hide');
  }
}
