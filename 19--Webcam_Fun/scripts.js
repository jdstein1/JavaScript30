/* scripts.js */

/* DOM NODES */

const video = document.querySelector('.video');
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const snapLimit = document.querySelector('#limit');

const ctrlFx = document.querySelector('.ctrl_fx');
const selectFx = ctrlFx.querySelector('#fx');

const ctrls = ctrlFx.querySelectorAll('table');

const ctrlChroma = ctrlFx.querySelector('#ctrl_fx--chroma');
const inputsChroma = ctrlFx.querySelectorAll('#ctrl_fx--chroma input')

const ctrlSplit = ctrlFx.querySelector('#ctrl_fx--split');
const selectSplit = ctrlFx.querySelector('#split');


/* VARIABLES */
let myStream;
let front = true;
let positionX = 0;
let positionY = 0;
let stripLen = 0;
let stripLimit = true;
const stripMax = 5;
const stripItemW = 150;
let videoInterval;

ctrlFx.style.display = 'none';
selectFx.disabled = true;
snapLimit.checked = stripLimit;


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

function getVideo(mode) {
  console.group('START getVideo', mode);
  navigator.mediaDevices.getUserMedia(videoSettings)
  .then(function(mediaStream) {
    myStream = mediaStream;
    if (mode && mode === 'start') {
      video.src = window.URL.createObjectURL(myStream);
      video.onloadedmetadata = function(e) {
        video.play();
      };
      ctrlFx.style.display = 'block';
      selectFx.disabled = false;
    } else {
      video.src = '';
      myStream.active = false;
      ctrlFx.style.display = 'none';
      selectFx.disabled = true;
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

function videoToCanvas() {
  console.group('START videoToCanvas');
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
    ints.push(Math.floor(Math.random()*25)+Math.floor(Math.random()*250));
    ints.push(Math.floor(Math.random()*25)+Math.floor(Math.random()*250));
    ints.push(Math.floor(Math.random()*25)+Math.floor(Math.random()*250));
    // console.log('ints: ', ints);
    for (var i = 0; i < ints.length; i++) {
      ints[i] *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    }
  }
  console.log('ints: ', ints);

  console.log(selectFx.value);
  if (selectFx.value === 'chroma') {
    for (var i = 0; i < inputsChroma.length; i++) {
      // console.log('input: ',inputsChroma[i]);
      inputsChroma[i].readOnly = false;
    }
  } else {
    for (var i = 0; i < inputsChroma.length; i++) {
      // console.log('input: ',inputsChroma[i]);
      inputsChroma[i].readOnly = true;
    }
  }

  // console.log(canvas.width,canvas.height);
  function videoFX (fx) {
    // console.log('fx: ', fx);
    toggleControls(fx);
    ctx.drawImage(video,positionX,positionY,vWidth,vHeight);
    let pixels = ctx.getImageData(positionX,positionY,vWidth,vHeight);

    /* manipulate pixels */
    switch(fx) {
      case 'chroma':
        pixels = fxChromaKey(pixels);
        break;
      case 'split':
        pixels = fxSplit(pixels,ints);
        break;
      case 'r_channel':
        pixels = fxRGB(pixels,'red');
        break;
      case 'g_channel':
        pixels = fxRGB(pixels,'green');
        break;
      case 'b_channel':
        pixels = fxRGB(pixels,'blue');
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
    snap.currentTime = 0;
    snap.play();

    /* take photo data from canvas */
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download','picture.jpg');
    link.innerHTML = `<img src="${data}" alt="download picture" />`;
    link.style.width = stripItemW+'px';
    console.log('link',link);

    /* put photo snaps into strip */
    // stripLen++;
    /* set a max limit on number of photo snaps */
    // stripLimit = true;
    if (stripLimit && (stripLen < stripMax)) {
      console.log('NO LIMIT');
      stripLen++;
    } else {
      console.log('YES LIMIT');
      stripLen = stripMax;
      strip.removeChild(strip.lastChild);  
    }
    console.log('stripLen: ', stripLen);

    if (stripLen>0) {
      strip.style.display = 'flex';
    }
    strip.insertBefore(link,strip.firstChild);
    strip.style.width = stripItemW+20+'px'

  }
  console.groupEnd();
}

function clearCanvas() {
  console.group('START clearCanvas');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.groupEnd();
}

function clearStrip() {
  console.group('START clearStrip');
  strip.innerHTML = ``;
  console.groupEnd();
}

function flipCamera() {
  console.group('START flipCamera');
  front = !front;
  console.groupEnd();
}

function startStream() {
  console.group('START startStream');
  clearInterval(videoInterval);
  getVideo('start');
  console.groupEnd();
}

function stopStream() {
  console.group('CAMERA OFF');
  clearInterval(videoInterval);
  getVideo('stop');
  console.groupEnd();
}

function toggleControls (x) {
  for (var i = 0; i < ctrls.length; i++) {
    ctrls[i].style.display = 'none';
  }
  if (x) {
    // console.warn('x!')
    /* manipulate pixels */
    switch(x) {
      case 'chroma':
        ctrlChroma.style.display = 'table';
        // ctrlChroma.style.display = 'block';
        break;
      case 'split':
        ctrlSplit.style.display = 'table';
        // ctrlSplit.style.display = 'block';
        break;
      case 'r_channel':
        break;
      case 'g_channel':
        break;
      case 'b_channel':
        break;
    }
  } else {
    // console.warn('no x!')
  }
}
toggleControls();


/* EVENT LISTENERS */
video.addEventListener('canplay',videoToCanvas);
snapLimit.addEventListener('click',(e)=>{
  console.log(e.target.checked);
});
selectFx.addEventListener('change',(e)=>{
  console.log('selectFx: ',e.target.value);
});
selectSplit.addEventListener('change',(e)=>{
  console.log('selectSplit: ',e.target.value);
});