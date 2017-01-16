
/* DOM NODES */
const video = document.querySelector('.video');
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const stripList = strip.querySelector('ul');
const snap = document.querySelector('.snap');

/* VARIABLES */
let myStream;
let front = true;
let positionX = 0;
let positionY = 0;
let stripLen = 0;
const stripMax = 5;
const stripItemW = 150;

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
  console.log(video);

  const vWidth = video.videoWidth;
  const vHeight = video.videoHeight;
  console.log('vWidth:'+vWidth,'vHeight:'+vHeight);

  const wWidth = window.innerWidth;
  const wHeight = window.innerHeight;
  console.log('wWidth:'+wWidth,'wHeight:'+wHeight);

  /* set canvas to W&H of window */
  canvas.width = wWidth;
  canvas.height = wHeight;

  /* center the canvas */
  // positionX = (wWidth - vWidth)/2;
  // positionY = (wHeight - vHeight)/2;

  if (vWidth < wWidth && vHeight > wHeight) {
    console.log('video taller than window');
    // stretch video vertically...
    canvas.width = vWidth;
    canvas.height = wHeight;
  } else if (vWidth > wWidth && vHeight < wHeight) {
    console.log('video wider than window');
    // stretch video horizontally...
    canvas.width = wWidth;
    canvas.height = vHeight;
  } else {
    console.log('video ??? than window');
    canvas.width = vWidth;
    canvas.height = vHeight;
  }

  // console.log(canvas.width,canvas.height);
  return setInterval(() => {
    ctx.drawImage(video,positionX,positionY,vWidth,vHeight);
    let pixels = ctx.getImageData(positionX,positionY,vWidth,vHeight);

    /* manipulate pixels */
    pixels = fxChromaKey(pixels);
    // pixels = fxSplit(pixels);
    // pixels = fxRGB(pixels,'blue');

    /* control ghosting effect */
    ctx.globalAlpha = 0.5;

    /* put pixels back */
    ctx.putImageData(pixels,positionX,positionY);

    // console.log('pixels: ', pixels);
    // debugger;

  }, 100);
  console.groupEnd();
}

function snapPhoto() {
  console.group('START snapPhoto');
  if (video.src !== '') {
    /* make snap sound */
    snap.currentTime = 0;
    snap.play();

    /* take photo data from canvas */
    // const item = document.createElement('li');
    // item.style.width = stripItemW+'px';
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download','picture.jpg');
    link.innerHTML = `<img src="${data}" alt="download picture" />`;
    link.style.width = stripItemW+'px';
    // item.appendChild(link);
    console.log('link',link);

    /* put photo snaps into strip */
    stripLen++;
    strip.insertBefore(link,strip.firstChild);
    // strip.insertBefore(item,strip.firstChild);
    // console.log(item.clientHeight);
    // strip.style.height = (stripLen*(stripItemW+0))+'px'
    // strip.style.width = strip.style.height = link.clientHeight+40+'px';

    /* set a max limit on number of photo snaps */
    // if (stripLen < stripMax) {
    //   stripLen++;
    // } else {
    //   stripLen = stripMax;
    //   strip.removeChild(strip.lastChild);  
    // }

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
