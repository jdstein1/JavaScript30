/* utils.js */
console.log('utils.js READY!');
// toggle button enable/disable
function toggleButton(button,condition) {
  if (condition) {
    switch(condition) {
      case 'off':
        button.disabled = true;
        button.classList.add('disabled');
        break;
      case 'on':
        button.disabled = false;
        button.classList.remove('disabled');
        break;
    }
  } else {
    button.disabled = !button.disabled;
    button.classList.toggle('disabled');
  }
}