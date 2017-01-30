/* utils.js */
console.log('utils.js READY!');
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

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
