/* scripts.js */

/* DOM NODES */
const video = document.querySelector('.video');
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const fxSelect = document.querySelector('#fx');
const inputs = document.querySelectorAll('.ctrl_fx')
const inputLimit = document.querySelector('#limit');

/* VARIABLES */
let myStream;
let front = true;
let positionX = 0;
let positionY = 0;
let stripLen = 0;
let stripLimit = true;
const stripMax = 5;
const stripItemW = 150;

inputLimit.checked = stripLimit;

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
    } else {
      video.src = '';
      myStream.active = false;
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

  const randoms = [];
  randoms.push(Math.floor(Math.random()*100));
  randoms.push(Math.floor(Math.random()*100));
  randoms.push(Math.floor(Math.random()*100));
  console.log('randoms: ', randoms);

  console.log(fxSelect.value);
  if (fxSelect.value = 'chroma') {
    for (var i = 0; i < inputs.length; i++) {
      // console.log('input: ',inputs[i]);
      inputs[i].readOnly = false;
    }
  } else {
    for (var i = 0; i < inputs.length; i++) {
      // console.log('input: ',inputs[i]);
      inputs[i].readOnly = true;
    }
  }

  // console.log(canvas.width,canvas.height);
  function videoFX (fx) {
      ctx.drawImage(video,positionX,positionY,vWidth,vHeight);
      let pixels = ctx.getImageData(positionX,positionY,vWidth,vHeight);
  
      /* manipulate pixels */
      switch(fx) {
        case 'chroma':
          pixels = fxChromaKey(pixels);
          break;
        case 'split':
          pixels = fxSplit(pixels,randoms);
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
  
      /* put pixels back */
      ctx.putImageData(pixels,positionX,positionY);
  
      // console.log('pixels: ', pixels);
      // debugger;
  
    }
  const videoInterval = setInterval(()=>{
    videoFX(fxSelect.value);
  }, 100);
  return videoInterval 
  console.groupEnd();
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
  // myStream.active = true;
  getVideo('start');
  console.groupEnd();
}

function stopStream() {
  console.group('CAMERA OFF');
  getVideo('stop');
  console.groupEnd();
}

/* EVENT LISTENERS */
video.addEventListener('canplay',videoToCanvas);
inputLimit.addEventListener('click',(e)=>{
  console.log(e.target.checked);
})