
/* DOM NODES */
const video = document.querySelector('.video');
console.log('video: ', video);

const canvas = document.querySelector('.canvas');
console.log('canvas: ', canvas);

const ctx = canvas.getContext('2d');
console.log('ctx: ', ctx);

const strip = document.querySelector('.strip');
console.log('strip: ', strip);

const snap = document.querySelector('.snap');
console.log('snap: ', snap);


/* FUNCTIONS */
const myConstraints = {audio: true, video: {
    // width: { min: 1024, ideal: 1280, max: 1920 },
    // height: { min: 776, ideal: 720, max: 1080 },
    facingMode: "user"
  }};

function getVideo() {
  console.log('START getVideo');
  navigator.mediaDevices.getUserMedia(myConstraints)
  .then(function(mediaStream) {
    /* use the stream */
    console.log('mediaStream: ', mediaStream);
    /* method 1 */
    video.src = window.URL.createObjectURL(mediaStream);
    video.play();
    /* method 2 */
    // video.srcObject = mediaStream;
    // video.onloadedmetadata = function(e) {
    //   video.play();
    // };
  })
  .catch(function(err) {
    /* handle the error */
    console.error('err: ', err);
    // console.log(err.name + ": " + err.message); // always check for errors at the end.
  });
}
// getVideo();

function videoToCanvas() {
  console.log('START videoToCanvas');
  const w = video.videoWidth;
  const h = video.videoHeight;
  console.log(w,h);
}
videoToCanvas();

function takePhoto() {
  alert('I JUST TOOK YOUR PHOTO');
}

function startStream() {
  mediaStream.active = true;
}

function stopStream() {
  mediaStream.active = false;
}


/* EVENT LISTENERS */

