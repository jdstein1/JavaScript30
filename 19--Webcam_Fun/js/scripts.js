/* scripts.js */
console.log('scripts.js READY!');
/**
 * DOM NODES
 */

/* misc */
const video = document.querySelector('.video');
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snapSound = document.querySelector('.sound-snap');
const snapLimit = document.querySelector('#limit');
const allSelects = document.querySelectorAll('select');

/* F/X controls */
const ctrlFx = document.querySelector('.ctrl_fx');
const alertFx = ctrlFx.querySelector('.alert');
const alertFxMsgs = alertFx.querySelectorAll('.msg');
/* main select/option for F/X */
const selectFx = document.querySelector('#fx');
/* array of tables of control interfaces */
const ctrlTables = ctrlFx.querySelectorAll('table');
/* video channel colorize controls */
const ctrlColorize = document.querySelector('#ctrl_fx--colorize');
const selectColorize = document.querySelector('#colorize');
const btnApplyColorize = ctrlColorize.querySelector('.btn_apply');
/* video channel split controls */
const ctrlSplit = document.querySelector('#ctrl_fx--split');
const selectSplit = document.querySelector('#split');
const btnApplySplit = ctrlSplit.querySelector('.btn_apply');
/* video croma key controls */
const ctrlChroma = document.querySelector('#ctrl_fx--chroma');
const inputsChroma = document.querySelectorAll('#ctrl_fx--chroma input')

/* buttons */
const btnOn = document.querySelector('.ctrl_camera .btn_on');
const btnOff = document.querySelector('.ctrl_camera .btn_off');
const btnClearCam = document.querySelector('.ctrl_camera .btn_clear');
const btnClearStrip = document.querySelector('.ctrl_strip .btn_clear');
const btnSnap = document.querySelector('.ctrl_strip .btn_snap');

/**
 * VARIABLES
 */

let myStream;
let front = true;
let positionX = 0;
let positionY = 0;
let stripLen = 0;
let videoInterval;

const stripMax = 5;
const stripItemW = 140;
const videoSettings = {audio: false, video: true};

/**
 * DEFAULT STATES
 */

document.querySelector('.ctrl_strip label span').innerHTML = `Limit? (${stripMax})`;

/**
 * FUNCTIONS
 */

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
        ctrlChroma.style.display = 'table';
        break;
      case 'split':
        ctrlSplit.style.display = 'table';
        break;
      case 'colorize':
        ctrlColorize.style.display = 'table';
        break;
    }
  } else {
    console.log('...then done!');
    // console.warn('no x!')
  }
  console.groupEnd();
}
toggleControls();

if (navigator.mediaDevices) {
  console.info(navigator.mediaDevices.getSupportedConstraints());
  navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    devices.forEach(function(device) {
      console.log(device);
      // console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
    });
  })
  .catch(function(err) {
    console.error(err.name + ": " + err.message);
  });
/**
 * request access to client video and audio inputs.
 * @param  {[type]} mode -- ['start'|'stop']
 * @return {[type]}        [description]
 */
function accessMedia(mode) {
  console.group('START accessMedia');
  console.log('mode: ', mode);
  navigator.mediaDevices.getUserMedia(videoSettings)
  .then((mediaStream) => {
    // console.log('mediaStream: ', mediaStream);
    myStream = mediaStream;
    if (mode && mode === 'start') {
      // turn video on
      video.style.display = 'block';
      video.src = window.URL.createObjectURL(myStream);
      video.onloadedmetadata = (e) => {
        video.play();
      };
      // alertFx.style.display = 'none';
      alertFxMsgs[0].style.display = 'none';
      alertFxMsgs[1].style.display = 'block';
      selectFx.style.display = 'inline-block';
      // ctrlFx.classList.remove('disabled');
      selectFx.disabled = false;
      toggleButton(btnOff,'on');
      toggleButton(btnSnap,'on');
      // btnSnap.disabled = false;
      // btnSnap.classList.remove('disabled');
    } else {
      // turn video off
      video.style.display = 'none';
      video.src = '';
      // myStream.active = false;
      // alertFx.style.display = 'block';
      alertFxMsgs[0].style.display = 'block';
      alertFxMsgs[1].style.display = 'none';
      selectFx.selectedIndex = 0;
      for (var i = 0; i < allSelects.length; i++) {
        allSelects[i].selectedIndex = 0;
      }
      selectFx.style.display = 'none';
      selectFx.disabled = true;
      toggleButton(btnOff,'off');
      toggleButton(btnSnap,'off');
      // btnSnap.disabled = true;
      // btnSnap.classList.add('disabled');
      toggleControls();
      toggleButton(btnClearCam,'on');
      // btnClearCam.disabled = false;
      // btnClearCam.classList.remove('disabled');
    }
    // console.log('video.src: ',video.src);
    // console.log('myStream: ', myStream);
  })
  .catch((err) => {
    console.error('err: ', err.name);
    // console.log(err.name + ": " + err.message); // always check for errors at the end.
  });
  console.groupEnd();
}

/**
 * copy video pixels and put them in the canvas.
 * @return {[type]} [description]
 */
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

  let randoms = []; // random numbers
  randoms.push(Math.floor(Math.random()*25)+Math.floor(Math.random()*250));
  randoms.push(Math.floor(Math.random()*25)+Math.floor(Math.random()*250));
  randoms.push(Math.floor(Math.random()*25)+Math.floor(Math.random()*250));
  // console.log('randoms: ', randoms);
  for (var i = 0; i < randoms.length; i++) {
    randoms[i] *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
  }
  console.log('randoms: ', randoms);

  let intsSplit = [];
  if (selectSplit.value === 'stereo') {
    // expression
    intsSplit = [-144, -238, -235]; // stereo split
    // [247, -116, -26]
    // [-144, -238, -235]
    // [202, -202, -215]
    // [-141, 148, -96]
  } else if (selectSplit.value === 'rgb') {
    intsSplit = [-100, 198, -92]; // rgb split
    // [-115, -258, 25]
  } else {
    intsSplit = randoms;
  }
  // console.log('intsSplit: ', intsSplit);
  let intsColorize = [];
  if (selectColorize.value === 'red') {
    intsColorize = [150, -50, -50];
  } else if (selectColorize.value === 'green') {
    intsColorize = [-50, 150, -50];
  } else if (selectColorize.value === 'blue') {
    intsColorize = [-50, -50, 150];
  } else {
    intsColorize = randoms;
  }
  // console.log('intsColorize: ', intsColorize);

  // console.log('selectFx.value: ',selectFx.value);
  const effect = selectFx.value | '';
  console.log('effect: ', effect);
  /* enable F/X controls */
  if (effect === 'chroma') {
    console.log('toggle chroma controls');
    // get initial value for effect
  } else if (effect === 'split') {
    console.log('toggle split controls');
    // get initial value for effect
    console.log('selectSplit: ', selectSplit.value);
  } else if (effect === 'colorize') {
    console.log('toggle colorize controls');
    // get initial value for effect
    console.log('selectColorize: ', selectColorize.value);
  } else {
    console.log('no effect chosen yet');
  }
  // console.log(canvas.width,canvas.height);

/**
 * manipulate pixels with video effect.
 * @param  {[type]} fx [description]
 * @return {[type]}    [description]
 */
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
        pixels = fFxSplit(pixels,intsSplit);
        break;
      case 'colorize':
        pixels = fFxColorize(pixels,intsColorize);
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

/**
 * copy canvas data (photo with video manipulations) to a 
 * photo strip.
 * @return {[type]} [description]
 */
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

    /* set a max limit on number of photo snaps */
    stripLen++;
    if (snapLimit.checked && stripLen > stripMax) {
      console.log('YES LIMIT');
      stripLen = stripMax;
      strip.removeChild(strip.lastChild);
    }
    // console.log('stripLen: ', stripLen);

    if (stripLen > 0) {
      strip.style.display = 'flex';
      document.querySelector('.ctrl_strip legend').innerHTML = `snapshots (${stripLen})`;
      toggleButton(btnClearStrip,'on');
      // btnClearStrip.disabled = false;
      // btnClearStrip.classList.remove('disabled');
    } else {
      strip.style.display = 'none';
    }
 
    /* put photo snaps into strip */
    strip.insertBefore(link,strip.firstChild);
    strip.style.width = stripItemW+20+'px';

  }
  console.groupEnd();
}

/**
 * reset canvas to no image.
 * @return {[type]} [description]
 */
function clearCanvas() {
  console.group('START clearCanvas');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  toggleButton(btnClearCam,'off');
  // btnClearCam.disabled = true;
  // btnClearCam.classList.add('disabled');
  console.groupEnd();
}

/**
 * reset photo strip to empty HTML element.
 * @return {[type]} [description]
 */
function clearStrip() {
  console.group('START clearStrip');
  strip.innerHTML = ``;
  stripLen = 0;
  strip.style.display = 'none';
  toggleButton(btnClearStrip,'off');
  // btnClearStrip.disabled = true;
  // btnClearStrip.classList.add('disabled');
  document.querySelector('.ctrl_strip legend').innerHTML = 'snapshots';
  console.groupEnd();
}

/**
 * switch between front- and back-facing cameras (mobile devices only).
 * @return {[type]} [description]
 */
function flipCamera() {
  console.group('START flipCamera');
  front = !front;
  console.groupEnd();
}

/**
 * start/restart the video and audio media input recording.
 * @param  {[type]} effect [description]
 * @return {[type]}        [description]
 */
function startStream() {
  console.group('START startStream');
  clearInterval(videoInterval);
  accessMedia('start');
  console.groupEnd();
}

/**
 * stop the video and audio media input recording.
 * TODO: revoke access to video and audio media inputs.
 * @return {[type]} [description]
 */
function stopStream() {
  console.group('CAMERA OFF');
  clearInterval(videoInterval);
  accessMedia('stop');
  console.groupEnd();
}

/**
 * EVENT LISTENERS
 */

btnOn.addEventListener('click',startStream);
btnOff.addEventListener('click',stopStream);
btnSnap.addEventListener('click',snapPhoto);
btnClearCam.addEventListener('click',clearCanvas);
btnClearStrip.addEventListener('click',clearStrip);

/* when web cam starts, send pixels to canvas */
video.addEventListener('canplay',(e)=>{
  console.log('playing media');
  pixelsToCanvas();
});

/* listen to change on master F/X select/option */
selectFx.addEventListener('change',(e)=>{
  console.log('selectFx: ',e.target.value);
  toggleControls(e.target.value);
});

/* listen to change on video channel split F/X select/option */
selectSplit.addEventListener('change',(e)=>{
  console.log('selectSplit: ',e.target.value);
  startStream();
});

btnApplySplit.addEventListener('click',(e)=>{
  console.log(e.target);
  startStream();
});

/* listen to change on video channel colorize F/X select/option */
selectColorize.addEventListener('change',(e)=>{
  console.log('selectColorize: ',e.target.value);
  startStream();
});

btnApplyColorize.addEventListener('click',(e)=>{
  console.log(e.target);
  startStream();
});

} else {
  console.error('navigator.mediaDevices NOT supported!');
}

