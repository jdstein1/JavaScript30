/* fx-invert.js */
console.log('fx-invert.js READY!');
/**
 * this effect function takes CANVAS element ImageData (Uint8Array) with a data 
 * property that holds RGBA information in an Uint8ClampedArray...
 */

/**
 * [fFxInvert description]
 * @return {[type]} [description]
 */
function fFxInvert (pixels) {
  for (var i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = 255 - pixels.data[i]; // red
    pixels.data[i+1] = 255 - pixels.data[i+1]; // green
    pixels.data[i+2] = 255 - pixels.data[i+2]; // blue
  }
  return pixels;
};
