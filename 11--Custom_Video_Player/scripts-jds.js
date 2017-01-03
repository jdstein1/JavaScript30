/**
 * get elements
 */
const player = document.querySelector('.player');
// console.log('player: ', player);

const video = player.querySelector('.viewer');
// console.log('video: ', video);

const controls = player.querySelector('.player__controls');
// console.log('controls: ', controls);

const progress = controls.querySelector('.progress');
// console.log(progress);
const progressBar = controls.querySelector('.progress__filled');
// console.log(progressBar);

const toggle = controls.querySelector('.toggle');
console.log(toggle);
const skipButtons = controls.querySelectorAll('[data-skip]');
// console.log(skipButtons);
const ranges = controls.querySelectorAll('[type="range"]');
// console.log(ranges);

/**
 * create functions
 */
function togglePlayer (e) {
  // console.group('START togglePlayer');
  // console.log('e.target: ',e.target);
  // console.log('this: ',this);

  /* Stop propagation */
  e = e || window.event // cross-browser event
  if (e.stopPropagation) {
      // W3C standard variant
      e.stopPropagation()
  } else {
      // IE variant
      e.cancelBubble = true
  }

  // if (video.paused) {
  //   video.play();
  // } else {
  //   video.pause();
  // }
  /* or */
  const method = video.paused ? 'play':'pause';
  video[method]();
  // console.groupEnd();
}

// change icon of button when toggling play/pause.
function toggleButton() {
/*
play triangle
&rtrif;
&blacktriangleright;
&#x025B8;
&#9656;

*pause marker (use 2)
&marker;
&#x025AE;
&#9646;
*/
  video.paused ? toggle.innerHTML='►' : toggle.innerHTML='▮▮';
}

function skip() {
  console.log('SKIPPING!!',this.dataset.skip);
  const skipVal = parseFloat(this.dataset.skip);
  console.log('old currentTime: ',video.currentTime);
  if (video.played) {
    video.currentTime += (skipVal);
  }
  console.log('new currentTime: ',video.currentTime);
}

function updateRange() {
  console.log('updateRange: ', this.name,'value: '+this.value);
  console.log('old video['+this.name+'] =', video[this.name]);
  video[this.name] = this.value;
  console.log('new video['+this.name+'] =', video[this.name]);
}

function autoProgress() {
  if (!isSkipping) {
    // console.group('START autoProgress');
    // console.log('autoProgress -- video.duration', video.duration);
    console.log('autoProgress -- old progressBar: ', progressBar.style.flexBasis);
    progressBar.style.flexBasis = (video.currentTime / video.duration)*100+'%';
    console.log('autoProgress -- new progressBar: ', progressBar.style.flexBasis);
    // console.groupEnd();
  }
}

window.setInterval(autoProgress, 100);

let isSkipping = false;

/*function manualProgress(e) {
  if (isSkipping) {
    // console.group('START manualProgress: ', isSkipping);
    // console.log('manualProgress -- e.type: ', e.type);
    console.log('manualProgress -- e.target: ', e.target);
    console.log('manualProgress -- progressBar: ', progressBar);
    // console.log('manualProgress -- e.target.style.flexBasis: ', e.target.style.flexBasis);
    // console.log('manualProgress -- e.target.offsetWidth: ', e.target.offsetWidth);
    // console.log('manualProgress -- e.offsetX: ', e.offsetX);
    // console.log('manualProgress -- old manualProgress: ', progressBar.style.flexBasis);
    console.log('manualProgress -- old video.currentTime: ',video.currentTime);
    video.currentTime = video.duration * (e.offsetX / e.target.offsetWidth);
    // progressBar.style.flexBasis = (e.offsetX / e.target.offsetWidth)*100+'%';
    console.log('manualProgress -- new video.currentTime: ',video.currentTime);
    // console.log('manualProgress -- progressBar.style.flexBasis: ',progressBar.style.flexBasis);
    // autoProgress;
    // console.log('manualProgress -- new manualProgress: ', progressBar.style.flexBasis);
    // console.groupEnd();
  }
}*/

/**
 * hook up event listeners
 */
video.addEventListener('click',togglePlayer);
video.addEventListener('play',toggleButton);
video.addEventListener('pause',toggleButton);
toggle.addEventListener('click',togglePlayer);
skipButtons.forEach(button => button.addEventListener('click',skip));
ranges.forEach(range => range.addEventListener('change',updateRange));

// progress.addEventListener('mousedown', () => isSkipping = true);
// progress.addEventListener('mousemove',manualProgress);
// progress.addEventListener('mouseup', () => isSkipping = false);
// progress.addEventListener('mouseout', () => isSkipping = false);
