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
const mirror = document.querySelector('#mirror');
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
const inputAllChromaKey = document.querySelectorAll('#ctrl_fx_chroma .input-range');
const rgbMin = document.querySelector('.min .rgb');
const rgbMax = document.querySelector('.max .rgb');

/* video saturation controls */
const ctrlSaturate = document.querySelector('#ctrl_fx_saturate');
const inputSaturate = document.querySelector('#saturate');

/* video resolution controls */
const ctrlPixelate = document.querySelector('#ctrl_fx_pixelate');
const inputPixelate = document.querySelector('#pixelate');

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
let canvasScale = 1;
const stripMax = 5;
const stripItemW = 140;
const constraints = {audio: false, video: true};

/**
 * DEFAULT STATES
 */

hide(video);
show(btnOn);
hide(btnOff);
// hide(selectFx);
// selectFx.disabled = true;
document.querySelector('#ctrl_strip label span .value').innerHTML = `${stripMax}`;

/**
 * FUNCTIONS
 */

/**
 * set background color of chroma range input labels.  also put value number 
 * in the UI.
 * @return {[type]} [description]
 */
function fChromaKeyInputs (group) {
  console.group('START fChromaKeyInputs');
  const levels = {};
  group.forEach((input) => {
    if (input.type === 'range'||input.type === 'number') {
      levels[input.name] = input.value;
      const label = input.parentElement;
      label.querySelector("span .value").innerHTML = input.value;
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
  // console.log('levels: ', levels);
  rgbMin.querySelector("input").style.backgroundColor = `rgb(${levels["rmin"]},${levels["gmin"]},${levels["bmin"]})`;
  rgbMax.querySelector("input").style.backgroundColor = `rgb(${levels["rmax"]},${levels["gmax"]},${levels["bmax"]})`;
  console.groupEnd();
}
fChromaKeyInputs(inputAllChromaKey);

/**
 * set background color of chroma range input labels.  also put value number 
 * in the UI.
 * @return {[type]} [description]
 */
function fUpdateInput (input) {
  console.group('START fUpdateInput');
  // console.log('input.value: ', input.value);
  // console.log('input.min: ', input.min);
  // console.log('input.max: ', input.max);
  // console.log('input.diff: ', Math.abs(input.min-input.max));
  const valRange = Math.abs(input.min-input.max);
  if (input.type === 'range'||input.type === 'number') {
    const label = input.parentElement;
    label.querySelector("span").querySelector("code").innerHTML = input.value;
    // const cell = label.parentElement;
    let bg, br;
    if (input.id==='saturate') {
      bg = `hsla(0,${input.value/2}%,50%,1)`;
    } else if (input.id==='pixelate') {
      bg = `#808080`;
      br = `${1/input.value}rem`;
    } else {
      // console.warn(' NOT saturate OR pixelate!');
    }
    label.querySelector("code").style.backgroundColor = bg;
    label.querySelector("code").style.borderRadius = br;
    // label.querySelector("input").style.backgroundColor = bg;
  }
  console.groupEnd();
}
inputAllRange.forEach((input)=>{
  fUpdateInput(input);
});


function fMirror () {
  if (mirror.checked) {
    // console.log('FLIP IT');
    canvas.style.transform = `scale(-${canvasScale},${canvasScale})`;
    // canvas.style.transform = 'scale(-1,1)';
  } else {
    // console.log('DON\'T FLIP IT');
    canvas.style.transform = `scale(${canvasScale},${canvasScale})`;
    // canvas.style.transform = 'scale(1,1)';
  }
}
fMirror();

/**
 * [toggleFxControls description]
 * @return {[type]}   [description]
 */
function toggleFxControls () {
  console.group('START toggleFxControls');
  // console.log('hide all controls...');
  hide(ctrlAll);
  // console.log('...then hide all alerts except "cam" alert...');
  hide(alertAllMsg,alertMsgCam);
  // show(alertMsgCam);
  if (selectFx.selectedIndex>0) {
    // console.log('...then show __'+selectFx.selectedIndex+'__ controls!');
    hide(alertAllMsg);
    show(ctrlAll[selectFx.selectedIndex-1]);
  } else {
    // console.log('...then done!');
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
      input.parentElement.querySelector("span .value").style.display = window.innerWidth<800 ? 'none' : 'inline';
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
    // console.log('mode: ', mode);
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

        hide(btnOn);
        show(btnOff);
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

        show(btnOn);
        hide(btnOff);
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
    // console.log('vWidth:'+vWidth+' / vHeight:'+vHeight);

    const vArea = vWidth*vHeight;
    // console.log('vArea: ', vArea);

    const vRatio = vWidth/vHeight;
    // console.log('vRatio: ', vRatio);

    const wWidth = window.innerWidth;
    const wHeight = window.innerHeight;
    // console.log('wWidth:'+wWidth+' / wHeight:'+wHeight);

    const wArea = wWidth*wHeight;
    // console.log('wArea: ', wArea);

    const wRatio = wWidth/wHeight;
    // console.log('wRatio: ', wRatio);

    function fCheckArea (a,b) {
      console.group('START fCheckArea');
      let area;
      const aA = a[0]*a[1];
      const bA = b[0]*b[1];
      if (aA > bA) {
        // console.info('video is __bigger__ than window');
        area = 'bigger';
      } else if (aA < bA) {
        // console.info('video is __smaller__ than window');
        area = 'smaller';
      } else {
        // console.info('video and window are __same__ size');
        area = 'same';
      }
      console.groupEnd();
      return area;
    }

    function fCheckRatio (a,b) {
      console.group('START fCheckRatio');
      let ratio;
      const aR = a[0]/a[1];
      const bR = b[0]/b[1];
      if (aR > bR) {
        // console.info('window has __portrait__ aspect ratio, scale based on HEIGHT');
        ratio = 'portrait';
      } else if (aR < bR) {
        // console.info('window has __landscape__ aspect ratio, scale based on WIDTH');
        ratio = 'landscape';
      } else {
        // console.info('window has __standard__ aspect ratio, scale based on AREA');
        ratio = 'standard';
      }
      console.groupEnd();
      return ratio;
    }

    function fCanvasScale (a,b) {
      console.group('START fCanvasScale: ', a,b);

      const aspect_ratio = fCheckRatio(a,b);
      const video_area = fCheckArea(a,b);

      /**
       * only scale if video is smaller than window...otherwise use inherited 
       * "1" as scale value...
       */
      if (video_area === 'smaller') {
        // console.warn('video smaller');
        if (aspect_ratio === 'landscape') {
          // console.warn('landscape');
          canvasScale = (b[0]/a[0]); // enlarge based on WIDTH ratio
        } else if (aspect_ratio === 'portrait') {
          // console.warn('portrait');
          canvasScale = (b[1]/a[1]); // enlarge based on HEIGHT ratio
        } else {
          // console.warn('same');
          canvasScale = (b[1]/a[1]); // enlarge based on HEIGHT ratio
        }
      }
      console.log('canvasScale: ',canvasScale);
    }
    // fCanvasScale([vWidth,vHeight],[wWidth,wHeight]);

    canvas.width = wWidth;
    canvas.height = wHeight;

    fMirror();
    // if (mirror.checked) {
    //   canvas.style.transform = `scale(-${canvasScale},${canvasScale})`;
    // } else {
    //   canvas.style.transform = `scale(${canvasScale},${canvasScale})`;
    // }
    // console.log('canvas.style.transform: ',canvas.style.transform);

    /* center the canvas */
    // positionX = (wWidth - vWidth)/2;
    // positionY = (wHeight - vHeight)/2;

    let randoms = []; // random numbers
    randoms.push(Math.floor(Math.random()*25)+Math.floor(Math.random()*250));
    randoms.push(Math.floor(Math.random()*25)+Math.floor(Math.random()*250));
    randoms.push(Math.floor(Math.random()*25)+Math.floor(Math.random()*250));
    // console.log('randoms: ', randoms);
    for (var i = 0; i < randoms.length; i++) {
      randoms[i] *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    }
    // console.log('randoms: ', randoms);

    /* values for F/X function */
    console.group('selectSplit.value: ', selectSplit.value);
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
    console.groupEnd();

    /* values for F/X function */
    console.group('selectColorize.value: ', selectColorize.value);
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
    console.groupEnd();

    /* values for F/X function */
    const inputSaturateVal = parseInt(inputSaturate.value);
    console.group('inputSaturateVal: ', inputSaturateVal);
    let intsSaturate = [0.5,0.5];
    // console.log('intsSaturate: ', intsSaturate);
    intsSaturate = [(100-inputSaturateVal)/100,inputSaturateVal/100];
    // console.log('intsSaturate: ', intsSaturate);
    console.groupEnd();

    /* values for F/X function */
    console.group('inputPixelate.value: ', inputPixelate.value);
    const inputPixelateVal = parseInt(inputPixelate.value);
    console.group('inputPixelateVal: ', inputPixelateVal);
    let intPixelate = parseInt(inputPixelate.value);
    // console.log('intPixelate: ', intPixelate);
    console.groupEnd();

    /**
     * manipulate pixels with video effect.
     * @param  {[type]} fx [description]
     * @return {[type]}    [description]
     */
    function videoFX (fx) {
      // console.log('fx: ', fx);
      ctx.drawImage(video,positionX,positionY,vWidth,vHeight);
      let pixels = ctx.getImageData(positionX,positionY,vWidth,vHeight);

      // console.log(pixels.data.length); // 1,228,800 (bits)
      // console.log(pixels.data.length/4); // 307,200 (pixels)

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
        case 'Invert':
          pixels = fFxInvert(pixels);
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
        document.querySelector('#ctrl_strip legend .value').innerHTML = `${stripLen}`;
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
    document.querySelector('#ctrl_strip legend .value').innerHTML = '0';
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
    // console.log('playing media');
    pixelsToCanvas();
  });

  /* listen for change on master F/X select/option */
  selectFx.addEventListener('change',(e)=>{
    // console.log('selectFx: ',e.target.value);
    toggleFxControls();
  });

  /* listen for change on mirror checkbox */
  // mirror.addEventListener('change',(e)=>{
  //   console.log('mirror: ',mirror.checked);
  //   startStream();
  // });

  /* listen for change on mirror checkbox */
  mirror.addEventListener('change',fMirror);

  /* listen for change on deeper F/X select/option */
  inputAllSelect.forEach(btn => {
    btn.addEventListener('change',(e)=>{
      // console.log('inputAllSelect: ',e.target);
      startStream();
    })
  });

  inputSaturate.addEventListener('change',(e)=>{
      fUpdateInput(inputSaturate);
  });

  inputPixelate.addEventListener('change',(e)=>{
      fUpdateInput(inputPixelate);
  });

  inputAllChromaKey.forEach(input => {
    input.addEventListener('change',(e)=>{
      fChromaKeyInputs(inputAllChromaKey);
    })
  });

  /* update UI on mousemove */
  // inputAllChromaKey.forEach(input => {
  //   input.addEventListener('mousemove',(e)=>{
  //     fChromaKeyInputs(inputAllChromaKey);
  //   })
  // });

  // let flagSaturate = false;
  inputSaturate.addEventListener('change',startStream);
  // inputSaturate.addEventListener('mousedown',(e)=>{
  //   flagSaturate = true;
  // });
  // inputSaturate.addEventListener('mousemove',(e)=>{
  //   if (flagSaturate) {
  //     startStream();
  //   }
  // });
  // inputSaturate.addEventListener('mouseup',(e)=>{
  //   flagSaturate = false;
  // });

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
selectFx.selectedIndex = 6;
toggleFxControls();

