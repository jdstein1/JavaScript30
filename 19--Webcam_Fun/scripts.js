
/* DOM NODES */
const video = document.querySelector('.video');
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

/* VARIABLES */
let myStream;
let front = true;
let positionX = 0;
let positionY = 0;

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
      /* method 1 */
      video.src = window.URL.createObjectURL(myStream);
      // video.play();
      /* method 2 */
      // video.srcObject = myStream;
      video.onloadedmetadata = function(e) {
        video.play();
        videoToCanvas();
      };
    } else {
      video.src = '';
    }
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
  console.log(vWidth,vHeight);

  const wWidth = window.innerWidth;
  const wHeight = window.innerHeight;
  console.log(wWidth,wHeight);

  canvas.width = vWidth;
  canvas.height = vHeight;

  // positionX = (wWidth - vWidth)/2;
  // positionY = (wHeight - vHeight)/2;

  if (vWidth < wWidth && vHeight > wHeight) {
    console.log('video taller than window');
    // stretch video vertically...
    // canvas.width = vWidth;
    // canvas.height = wHeight;
  } else if (vWidth > wWidth && vHeight < wHeight) {
    console.log('video wider than window');
    // stretch video horizontally...
    // canvas.width = wWidth;
    // canvas.height = vHeight;
  } else {
    console.log('video ??? than window');
    // canvas.width = vWidth;
    // canvas.height = vHeight;
  }

  // console.log(canvas.width,canvas.height);
  return setInterval(() => {
    ctx.drawImage(video,positionX,positionY,vWidth,vHeight);
  }, 100);
  console.groupEnd();
}

function snapPhoto() {
  console.group('START snapPhoto');
  strip.innerHTML += `
    <img src="${canvas.toDataURL('image/webp')}" alt="" />
  `;
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
