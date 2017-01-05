/**
 * get elements
 */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const controls = player.querySelector('.player__controls');
const progress = controls.querySelector('.progress');
const progressBar = controls.querySelector('.progress__filled');
const toggle = controls.querySelector('.toggle');
const skipButtons = controls.querySelectorAll('[data-skip]');
const ranges = controls.querySelectorAll('[type="range"]');
const fullScreen = controls.querySelector('[name="fullScreen"]');

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
  // console.log('SKIPPING!!',this.dataset.skip);
  const skipVal = parseFloat(this.dataset.skip);
  // console.log('old currentTime: ',video.currentTime);
  if (video.played) {
    video.currentTime += (skipVal);
  }
  // console.log('new currentTime: ',video.currentTime);
}

function updateRange() {
  // console.log(this);
  // console.log('updateRange: ', this.name,'value: '+this.value);
  // console.log('old video['+this.name+'] =', video[this.name]);
  video[this.name] = this.value;
  // console.log('new video['+this.name+'] =', video[this.name]);
}

function fill() {
  if (!isScrubbing) {
    // console.group('START fill -- isScrubbing: ', isScrubbing);
    // console.log('fill -- old currentTime: ', video.currentTime);
    // progressBar.style.flexBasis = (video.currentTime / video.duration)*100+'%';
    const percent = (video.currentTime / video.duration)*100;
    // console.log(percent);
    progressBar.style.flexBasis = `${percent}%`;
    // console.log('fill -- new currentTime: ', video.currentTime);
    // console.groupEnd();
  }
}

let isScrubbing = false;

function scrub(e) {
  /* Stop propagation */
  e = e || window.event // cross-browser event
  if (e.stopPropagation) {
      // W3C standard variant
      e.stopPropagation()
  } else {
      // IE variant
      e.cancelBubble = true
  }
  // console.group('START scrub -- isScrubbing: ', isScrubbing);
  // console.log('scrub -- old currentTime: ',video.currentTime);
  video.currentTime = video.duration * (e.offsetX / progress.offsetWidth);
  progressBar.style.flexBasis = (video.currentTime / video.duration)*100+'%';
  // console.log('scrub -- new currentTime: ',video.currentTime);
  // console.groupEnd();
}

function goFullscreen() {
  var el = video,
    rfs = el.requestFullscreen
      || el.webkitRequestFullScreen
      || el.mozRequestFullScreen
      || el.msRequestFullscreen 
  ;
  rfs.call(el);
}

/**
 * hook up event listeners
 */
video.addEventListener('click',togglePlayer);
video.addEventListener('play',toggleButton);
video.addEventListener('pause',toggleButton);
video.addEventListener('timeupdate',fill);

toggle.addEventListener('click',togglePlayer);

skipButtons.forEach(button => button.addEventListener('click',skip));

video.addEventListener('dblclick', goFullscreen);
fullScreen.addEventListener('click', goFullscreen);

ranges.forEach(range => range.addEventListener('change',updateRange));

progress.addEventListener('mousedown', () => {
  isScrubbing = true;
  scrub();
});
progress.addEventListener('mousemove', (e) => isScrubbing && scrub(e));
progress.addEventListener('mouseup', () => isScrubbing = false);
// progress.addEventListener('mouseout', () => isScrubbing = false); // do not use this event.
