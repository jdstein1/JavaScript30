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
const alertAllMsg = document.querySelectorAll('.alert');
const alertMsgCam = document.querySelector('#msg_cam');
const alertMsgFx = document.querySelector('#msg_fx');
const alertMsgErr = document.querySelector('#msg_err');
// const alertFx = ctrlFx.querySelector('.alert');

/* F/X controls */
/* select/option for main F/X control */
const selectFx = document.querySelector('#fx');
/* select/option for deeper F/X controls */

/* array of tables of control interfaces */
const ctrlFx = document.querySelector('#ctrl_fx');
const ctrlAll = ctrlFx.querySelectorAll('table');
const inputAllSelect = document.querySelectorAll('#ctrl_fx .input-select');
const inputAllRange = document.querySelectorAll('#ctrl_fx .input-range');

/* video channel colorize controls */
// const ctrlColorize = document.querySelector('#ctrl_fx_colorize');
const selectColorize = document.querySelector('#colorize');

/* video channel split controls */
// const ctrlSplit = document.querySelector('#ctrl_fx_split');
const selectSplit = document.querySelector('#split');

/* video croma key controls */
// const ctrlChromaKey = document.querySelector('#ctrl_fx_chroma');
const inputAllChromaKey = document.querySelectorAll('#ctrl_fx_chroma input');
const rgbMin = document.querySelector('.min .rgb');
const rgbMax = document.querySelector('.max .rgb');

/* video saturation controls */
const ctrlSaturate = document.querySelector('#ctrl_fx_saturate');
const inputSaturate = document.querySelector('#saturate');

/* buttons */
const btnAllApply = document.querySelectorAll('.btn_apply');
const btnAllClear = document.querySelectorAll('.btn_clear');
const btnOn = document.querySelector('#ctrl_camera .btn_on');
const btnOff = document.querySelector('#ctrl_camera .btn_off');
const btnClearCam = document.querySelector('#ctrl_camera .btn_clear');
const btnClearStrip = document.querySelector('#ctrl_strip .btn_clear');
const btnClearChroma = document.querySelector('#ctrl_fx_chroma .btn_clear');
const btnSnap = document.querySelector('#ctrl_strip .btn_snap');

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
const constraints = {audio: false, video: true};

/**
 * DEFAULT STATES
 */

hide(video);
// hide(selectFx);
// selectFx.disabled = true;
document.querySelector('#ctrl_strip label span').innerHTML = `Limit? (${stripMax})`;

/**
 * FUNCTIONS
 */

/**
 * set background color of chroma range input labels.  also put value number 
 * in the UI.
 * @return {[type]} [description]
 */
function fChromaKeyInputs () {
  console.group('START fChromaKeyInputs');
  const levels = {};
  inputAllChromaKey.forEach((input) => {
    if (input.type === 'range'||input.type === 'number') {
      levels[input.name] = input.value;
      const label = input.parentElement;
      label.querySelector("span").querySelector("code").innerHTML = input.value;
      const cell = label.parentElement;
      let bg;
      // console.log(cell.classList[0]+' '+cell.classList[1]+': '+input.value);
      if (cell.classList.contains("red")) {
        bg = `rgb(${input.value},0,0)`;
      } else if (cell.classList.contains("green")) {
        bg = `rgb(0,${input.value},0)`;
      } else {
        bg = `rgb(0,0,${input.value})`;
      }
      // label.querySelector("span").style.backgroundColor = bg;
      label.querySelector("code").style.backgroundColor = bg;
      label.querySelector("input").style.backgroundColor = bg;
      // console.log('test: ',label.querySelector("input[type='number']"));
      // label.querySelector("input[type='number']").style.backgroundColor = bg;
      // label.style.backgroundColor = bg;
      // e.target.parentElement.style.backgroundColor = `rgb(0,${e.target.value},0)`;
      // e.target.parentElement.innerHTML = `${e.target.value}`;
    }
  });
  console.log('levels: ', levels);
  rgbMin.querySelector("input").style.backgroundColor = `rgb(${levels["rmin"]},${levels["gmin"]},${levels["bmin"]})`;
  rgbMax.querySelector("input").style.backgroundColor = `rgb(${levels["rmax"]},${levels["gmax"]},${levels["bmax"]})`;
  console.groupEnd();
}
fChromaKeyInputs();

/**
 * [toggleFxControls description]
 * @return {[type]}   [description]
 */
function toggleFxControls () {
  console.group('START toggleFxControls');
  console.log('hide all controls...');
  hide(ctrlAll);
  console.log('...then hide all alerts except "cam" alert...');
  hide(alertAllMsg,alertMsgCam);
  // show(alertMsgCam);
  if (selectFx.selectedIndex>0) {
    console.log('...then show __'+selectFx.selectedIndex+'__ controls!');
    hide(alertAllMsg);
    show(ctrlAll[selectFx.selectedIndex-1]);
  } else {
    console.log('...then done!');
  }
  console.groupEnd();
}
toggleFxControls();

/**
 * JavaScript-based media queries.  Some are cosmetic CSS, some are more 
 * functional differences.
 * @return {[type]}          [description]
 */
function fMediaQueries () {
  console.log('window resize: ',window.innerWidth);
  // hide labels of mixed min/max color.
  document.querySelectorAll(".rgb label span").forEach((label)=>{
    label.style.display = window.innerWidth<800 ? 'none' : 'inline';
  });
  inputAllChromaKey.forEach((input)=>{
    if (input.type === 'range'||input.type === 'number') {
      /* switch input type between 'number'/'range' based on window size. */
      input.type = window.innerWidth<800 ? 'number' : 'range';
      /* show/hide color swatch based on window size (to match input type). */
      input.parentElement.querySelector("span code").style.display = window.innerWidth<800 ? 'none' : 'inline';
    }
      /* show/hide min rgb color label text based on window size. */
      // rgbMin.querySelector("span").style.display = window.innerWidth<800 ? 'none' : 'inline';
      /* show/hide max rgb color label text based on window size. */
      // rgbMax.querySelector("span").style.display = window.innerWidth<800 ? 'none' : 'inline';
  });
}
fMediaQueries();

/**
 * WRAP THE REST OF THE APP IN A CONDITIONAL THAT CHECKS FOR NECESSARY WEB API.
 * ONLY BROWSERS THAT CAN USE THE "navigator.mediaDevices" API CAN DO THE 
 * WEB CAM.
 */

// not every browser can access navigator.mediaDevices API...
if (navigator.mediaDevices) {

  navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    devices.forEach(function(device) {
      // console.log(device);
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
    hide(alertAllMsg);
    navigator.mediaDevices.getUserMedia(constraints)
    .then((mediaStream) => {
      // console.log('mediaStream: ', mediaStream);
      myStream = mediaStream;
      if (mode === 'start') {
        // turn video on
        video.style.display = 'block';
        video.src = window.URL.createObjectURL(myStream);
        video.onloadedmetadata = (e) => {
          video.play();
        };

        if (selectFx.selectedIndex === 0) {
          show(alertMsgFx);
        }

        /* reset & enable the F/X select/option */
        // toggleButton(selectFx,'on');

        toggleButton(btnOff,'on');
        toggleButton(btnSnap,'on');

      } else {
        // turn video off
        hide(video);
        video.src = '';
        // myStream.active = false;

        if (selectFx.selectedIndex === 0) {
          show(alertMsgCam);
        }

        /* reset & disable the F/X select/option */
        // toggleButton(selectFx,'off');

        toggleButton(btnOff,'off');
        toggleButton(btnSnap,'off');

        toggleFxControls();

        toggleButton(btnClearCam,'on');
      }
      // console.log('video.src: ',video.src);
      // console.log('myStream: ', myStream);
    })
    .catch((err) => {
      console.error('err: ', err.name);
      alertAllMsg[2].style.display = 'block';
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
    // console.log('randoms: ', randoms);

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

    const inputSaturateVal = parseInt(inputSaturate.value);
    console.log('inputSaturateVal: ', inputSaturateVal);
    let intsSaturate = [0.5,0.5];
    console.log('intsSaturate: ', intsSaturate);
    intsSaturate = [(100-inputSaturateVal)/100,inputSaturateVal/100];
    console.log('intsSaturate: ', intsSaturate);

    let intPixelate = 0;

    // console.log('selectFx.value: ',selectFx.value);
    // const effect = selectFx.value | '';
    // console.log('effect: ', effect);
    // /* enable F/X controls */
    // if (effect === 'chroma') {
    //   console.log('toggle chroma controls');
    //   // get initial value for effect
    // } else if (effect === 'split') {
    //   console.log('toggle split controls');
    //   // get initial value for effect
    //   // console.log('selectSplit: ', selectSplit.value);
    // } else if (effect === 'colorize') {
    //   console.log('toggle colorize controls');
    //   // get initial value for effect
    //   // console.log('selectColorize: ', selectColorize.value);
    // } else {
    //   console.log('no effect chosen yet');
    // }

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
        case 'Colorize':
          pixels = fFxColorize(pixels,intsColorize);
          break;
        case 'ChannelSplit':
          pixels = fFxChannelSplit(pixels,intsSplit);
          break;
        case 'ChromaKey':
          pixels = fFxChromaKey(pixels);
          break;
        case 'Saturate':
          pixels = fFxSaturate(pixels,intsSaturate);
          break;
        case 'Pixelate':
          pixels = fFxPixelate(pixels,intPixelate);
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
        document.querySelector('#ctrl_strip legend').innerHTML = `snapshots (${stripLen})`;
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
    document.querySelector('#ctrl_strip legend').innerHTML = 'snapshots';
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

  /* listen for change on master F/X select/option */
  selectFx.addEventListener('change',(e)=>{
    console.log('selectFx: ',e.target.value);
    toggleFxControls();
  });

  /* listen for change on deeper F/X select/option */
  inputAllSelect.forEach(btn => {
    btn.addEventListener('change',(e)=>{
      console.log('inputAllSelect: ',e.target);
      startStream();
    })
  });

  inputAllChromaKey.forEach(input => {
    input.addEventListener('change',(e)=>{
      fChromaKeyInputs();
    })
  });

  inputAllChromaKey.forEach(input => {
    input.addEventListener('mousemove',(e)=>{
      fChromaKeyInputs();
    })
  });

  let flagSaturate = false;
  inputSaturate.addEventListener('change',startStream);
  inputSaturate.addEventListener('mousedown',(e)=>{
    flagSaturate = true;
  });
  inputSaturate.addEventListener('mousemove',(e)=>{
    if (flagSaturate) {
      startStream();
    }
  });
  inputSaturate.addEventListener('mouseup',(e)=>{
    flagSaturate = false;
  });

  /* listen for click on all "apply" buttons */
  btnAllApply.forEach(btn => {
    btn.addEventListener('click',(e)=>{
      console.log('btnAllApply: ',e.target);
      startStream();
    })
  });

} else {
  console.error('web API navigator.mediaDevices NOT supported!');
  alertAllMsg[2].style.display = 'block';
}

/* dynamically apply media queries */
window.addEventListener('resize', fMediaQueries);

/* fake UI clicks to open controls */
startStream();
selectFx.selectedIndex = 4;
toggleFxControls();

