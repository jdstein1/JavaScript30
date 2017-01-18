/* utils.js */

// toggle button enable/disable
function toogleButton(button) {
  button.disabled = !button.disabled;
  button.classList.toggle('disabled');
}