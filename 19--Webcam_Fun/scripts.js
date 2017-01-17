/* scripts.js */

/* DOM NODES */

const video = document.querySelector('.video');
const photobooth = document.querySelector('.photobooth');
const photoboothA = document.querySelector('.photobooth::after');
const photoboothB = document.querySelector('.photobooth::before');
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const btnSnap = document.querySelector('#snap');
const snapSound = document.querySelector('.sound-snap');
const snapLimit = document.querySelector('#limit');

/* F/X controls */
const ctrlFx = document.querySelector('.ctrl_fx');
const alertFx = ctrlFx.querySelector('.alert');
const alertFxMsgs = alertFx.querySelectorAll('.msg');
/* main select/option for F/X */
const selectFx = ctrlFx.querySelector('#fx');
/* array of tables of control interfaces */
const ctrlTables = ctrlFx.querySelectorAll('table');
/* video croma key controls */
const fxChroma = ctrlFx.querySelector('#ctrl_fx--chroma');
const inputsChroma = ctrlFx.querySelectorAll('#ctrl_fx--chroma input')
/* video channel split controls */
const fxSplit = ctrlFx.querySelector('#ctrl_fx--split');
const selectSplit = ctrlFx.querySelector('#split');
/* video channel colorize controls */
const fxRGB = ctrlFx.querySelector('#ctrl_fx--rgb');
const selectRGB = ctrlFx.querySelector('#rgb');

/* buttons */
const btnCamOn = document.querySelector('.ctrl_camera .btn_on');
const btnCamOff = document.querySelector('.ctrl_camera .btn_off');
const btnCamClear = document.querySelector('.ctrl_camera .btn_clear');
const btnStripClear = document.querySelector('.ctrl_strip .btn_clear');
const btnStripSnap = document.querySelector('.ctrl_strip .btn_snap');

/* VARIABLES */
let myStream;
let front = true;
let positionX = 0;
let positionY = 0;
let stripLen = 0;
let stripLimit = true;
let videoInterval;

const stripMax = 5;
const stripItemW = 150;

/* default states */
// ctrlFx.style.display = 'none';
// ctrlFx.classList.add('disabled');
// selectFx.disabled = true;
selectFx.style.display = 'none';
snapLimit.checked = stripLimit;
document.querySelector('.ctrl_strip label span').innerHTML = `Limit? (${stripMax})`;


/* FUNCTIONS */

const videoSettings = {
  audio: false, 
  video: true
  // video: {
  //   width: { min: 1024, ideal: 1280, max: 1920 },
  //   height: { min: 776, ideal: 720, max: 1080 },
  //   facingMode: (front ? "user" : "environment")
  // }
};

function accessMedia(mode,effect) {
  console.group('START accessMedia');
  console.log('mode: ', mode);
  console.log('effect: ', effect);
  navigator.mediaDevices.getUserMedia(videoSettings)
  .then(function(mediaStream) {
    myStream = mediaStream;
    if (mode && mode === 'start') {
      // turn video on
      video.src = window.URL.createObjectURL(myStream);
      video.onloadedmetadata = function(e) {
        video.play();
      };
      // photoboothB.style.opacity = 0;
      // alertFx.style.display = 'none';
      alertFxMsgs[0].style.display = 'none';
      alertFxMsgs[1].style.display = 'block';
      selectFx.style.display = 'inline-block';
      // ctrlFx.classList.remove('disabled');
      selectFx.disabled = false;
      btnSnap.disabled = false;
      btnSnap.classList.remove('disabled');
    } else {
      // turn video off
      video.src = '';
      myStream.active = false;
      // photoboothB.style.opacity = '';
      // alertFx.style.display = 'block';
      alertFxMsgs[0].style.display = 'block';
      alertFxMsgs[1].style.display = 'none';
      selectFx.style.display = 'none';
      // ctrlFx.classList.add('disabled');
      selectFx.disabled = true;
      btnSnap.disabled = true;
      btnSnap.classList.add('disabled');
      toggleControls();
      btnCamClear.disabled = false;
      btnCamClear.classList.remove('disabled');
    }
    console.log('video.src: ',video.src);
    console.log('myStream: ', myStream);
  })
  .catch(function(err) {
    console.error('err: ', err.name);
    // console.log(err.name + ": " + err.message); // always check for errors at the end.
  });
  console.groupEnd();
}

function pixelsToCanvas() {
  console.group('START pixelsToCanvas');
  // console.log(video);

  const vWidth = video.videoWidth;
  const vHeight = video.videoHeight;
  // console.log('vWidth:'+vWidth,'vHeight:'+vHeight);

  const ratio = vWidth/vHeight;
  // console.log('ratio: ', ratio);

  const wWidth = window.innerWidth;
  const wHeight = window.innerHeight;
  // console.log('wWidth:'+wWidth,'wHeight:'+wHeight);

  /* set canvas to W&H of window */
  // canvas.width = wWidth;
  // canvas.height = wHeight;

  /* center the canvas */
  // positionX = (wWidth - vWidth)/2;
  // positionY = (wHeight - vHeight)/2;

  // if (vWidth < wWidth && vHeight > wHeight) {
  //   console.log('video taller than window');
  //   // stretch video vertically...
  //   canvas.width = vWidth;
  //   canvas.height = wHeight;
  // } else if (vWidth > wWidth && vHeight < wHeight) {
  //   console.log('video wider than window');
  //   // stretch video horizontally...
  //   canvas.width = wWidth;
  //   canvas.height = vHeight;
  // } else {
  //   console.log('video ??? than window');
    canvas.width = vWidth;
    canvas.height = vHeight;
  // }

  let ints = [];
  if (selectSplit.value === 'stereo') {
    // expression
    ints = [-144, -238, -235]; // stereo split
    // [247, -116, -26]
    // [-144, -238, -235]
    // [202, -202, -215]
    // [-141, 148, -96]
  } else if (selectSplit.value === 'rgb') {
    ints = [-100, 198, -92]; // rgb split
    // [-229, -231, 242]
  } else {
    // random numbers
    ints.push(Math.floor(Math.random()*25)+Math.floor(Math.random()*250));
    ints.push(Math.floor(Math.random()*25)+Math.floor(Math.random()*250));
    ints.push(Math.floor(Math.random()*25)+Math.floor(Math.random()*250));
    // console.log('ints: ', ints);
    for (var i = 0; i < ints.length; i++) {
      ints[i] *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    }
  }
  console.log('ints: ', ints);

  console.log('selectFx.value: ',selectFx.value);
  /* enable F/X controls */
  if (selectFx.value === 'chroma') {
    console.log('toggle chroma controls');
    // get initial value for effect
    
  } else if (selectFx.value === 'split') {
    console.log('toggle split controls');
    // get initial value for effect
    console.log('selectSplit: ', selectSplit.value);
  } else if (selectFx.value === 'rgb') {
    console.log('toggle rgb controls');
    // get initial value for effect
    console.log('selectRGB: ', selectRGB.value);
  } else {
  }

  // console.log(canvas.width,canvas.height);
  function videoFX (fx) {
    // console.log('fx: ', fx);
    ctx.drawImage(video,positionX,positionY,vWidth,vHeight);
    let pixels = ctx.getImageData(positionX,positionY,vWidth,vHeight);

    /* manipulate pixels */
    switch(fx) {
      case 'chroma':
        pixels = fFxChromaKey(pixels);
        break;
      case 'split':
        pixels = fFxSplit(pixels,ints);
        break;
      case 'rgb_channel':
        pixels = fFxRGB(pixels,ints);
        break;
    }

    /* control ghosting effect */
    // ctx.globalAlpha = 0.5;
    ctx.globalAlpha = 1;

    /* put pixels back */
    ctx.putImageData(pixels,positionX,positionY);

    // console.log('pixels: ', pixels);
    // debugger;

  }

  videoInterval = setInterval(()=>{
    videoFX(selectFx.value);
  }, 100);
  console.groupEnd();

  return videoInterval;
}

function snapPhoto() {
  console.group('START snapPhoto');
  if (video.src !== '') {
    /* make snap sound */
    snapSound.currentTime = 0;
    snapSound.play();

    /* take photo data from canvas */
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download','picture.jpg');
    link.innerHTML = `<img src="${data}" alt="download picture" />`;
    link.style.width = stripItemW+'px';
    // console.log('link',link);

    console.log('stripLimit: ', stripLimit);
    // console.log('stripMax: ', stripMax);
    /* set a max limit on number of photo snaps */
    // console.log('stripLen: ', stripLen);
    // if (!stripLimit && (stripLen < stripMax)) {
    stripLen++;
    if (stripLimit && stripLen > stripMax) {
      console.log('YES LIMIT');
      stripLen = stripMax;
      strip.removeChild(strip.lastChild);
    }
    // console.log('stripLen: ', stripLen);

    if (stripLen > 0) {
      strip.style.display = 'flex';
      document.querySelector('.ctrl_strip legend').innerHTML = `snapshots (${stripLen})`;
      btnStripClear.disabled = false;
      btnStripClear.classList.remove('disabled');
    } else {
      strip.style.display = 'none';
    }
 
    /* put photo snaps into strip */
    strip.insertBefore(link,strip.firstChild);
    strip.style.width = stripItemW+20+'px';

  }
  console.groupEnd();
}

function clearCanvas() {
  console.group('START clearCanvas');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  btnCamClear.disabled = true;
  btnCamClear.classList.add('disabled');
  console.groupEnd();
}

function clearStrip() {
  console.group('START clearStrip');
  strip.innerHTML = ``;
  stripLen = 0;
  strip.style.display = 'none';
  btnStripClear.disabled = true;
  btnStripClear.classList.add('disabled');
  console.groupEnd();
}

function flipCamera() {
  console.group('START flipCamera');
  front = !front;
  console.groupEnd();
}

function startStream(effect) {
  console.group('START startStream');
  clearInterval(videoInterval);
  accessMedia('start',effect);
  console.groupEnd();
}

function stopStream() {
  console.group('CAMERA OFF');
  clearInterval(videoInterval);
  accessMedia('stop');
  console.groupEnd();
}

/**
 * [toggleControls description]
 * @param  {[type]} x [description]
 * @return {[type]}   [description]
 */
function toggleControls (x) {
  console.group('START toggleControls');
  console.log('hide all controls...');
  for (var i = 0; i < ctrlTables.length; i++) {
    ctrlTables[i].style.display = 'none';
    // show alert
    alertFx.style.display = 'flex';
  }
  if (x && x.indexOf('Choose')<0) {
    console.log('...then show __'+x+'__ controls!');
    // hide alert
    alertFx.style.display = 'none';
    // console.warn('x!')
    /* manipulate pixels */
    switch(x) {
      case 'chroma':
        fxChroma.style.display = 'table';
        break;
      case 'split':
        fxSplit.style.display = 'table';
        break;
      case 'rgb_channel':
        fxRGB.style.display = 'table';
        break;
    }
  } else {
    console.log('...then done!');
    // console.warn('no x!')
  }
  console.groupEnd();
}
toggleControls();


/* EVENT LISTENERS */

/* when web cam starts, send pixels to canvas */
video.addEventListener('canplay',pixelsToCanvas);

/* set/unset limit on snapshots */
snapLimit.addEventListener('click',(e)=>{
  // console.log(e.target.checked);
  stripLimit = e.target.checked;
  console.log(stripLimit);
});

/* listen to change on master F/X select/option */
selectFx.addEventListener('change',(e)=>{
  console.log('selectFx: ',e.target.value);
    toggleControls(e.target.value);
});

/* listen to change on video channel split F/X select/option */
selectSplit.addEventListener('change',(e)=>{
  console.log('selectSplit: ',e.target.value);
  startStream(e.target.value);
});

/* listen to change on video channel colorize F/X select/option */
selectRGB.addEventListener('change',(e)=>{
  console.log('selectRGB: ',e.target.value);
  startStream(e.target.value);
});
