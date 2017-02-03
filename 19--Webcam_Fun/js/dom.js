/* dom.js */
console.log('dom.js READY!');
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

/* video resolution controls */
const ctrlBlend = document.querySelector('#ctrl_fx_blend');
const inputBlend = document.querySelector('#blend');

/* buttons */
const btnAllApply = document.querySelectorAll('.btn_apply');
const btnAllClear = document.querySelectorAll('.btn_clear');
const btnOn = document.querySelector('#ctrl_camera .btn_on');
const btnOff = document.querySelector('#ctrl_camera .btn_off');
const btnClearCam = document.querySelector('#ctrl_camera .btn_clear');
const btnClearStrip = document.querySelector('#ctrl_strip .btn_clear');
const btnClearChroma = document.querySelector('#ctrl_fx_chroma .btn_clear');
const btnSnap = document.querySelector('#ctrl_strip .btn_snap');
