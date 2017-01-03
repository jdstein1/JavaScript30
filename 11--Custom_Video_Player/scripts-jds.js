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
  console.group('START togglePlayer');
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
  console.groupEnd();
}

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

/**
 * hook up event listeners
 */
video.addEventListener('click',togglePlayer);
video.addEventListener('play',toggleButton);
video.addEventListener('pause',toggleButton);
toggle.addEventListener('click',togglePlayer);
skipButtons.forEach(button => button.addEventListener('click',skip));
ranges.forEach(range => range.addEventListener('change',updateRange));
