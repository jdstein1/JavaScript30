/* fx-chromakey.js */
console.log('fx-chromakey.js READY!');
/**
 * this effect function takes CANVAS element ImageData (Uint8Array) with a data 
 * property that holds RGBA information in an Uint8ClampedArray...
 */

/**
 * check if each pixel's color value falls within ranges set 
 * by inputs.  if it does, drop alpha value to 0 to hide pixel.
 * @param  {big array} data - The pixels.
 * @return {big array} - The modified pixels.
 */
function fFxChromaKey(pixels) {
  // console.log('START fFxChromaKey');
  // create empty array of min & max values
  const levels = {};
  // push values to array of min & max values
  document.querySelectorAll('#ctrl_fx_chroma input').forEach((input) => {
    levels[input.name] = input.value;
  });
  // console.log(levels);
  // debugger;
  for (let i = 0; i < pixels.data.length; i+=4) {
    // put values into vars
    red = pixels.data[i]; // r
    green = pixels.data[i+1]; // g
    blue = pixels.data[i+2]; // b
    alpha = pixels.data[i+3]; // a

    // check if values are within ranges
    if (red >= levels.rmin
      && red <= levels.rmax
      && green >= levels.gmin
      && green <= levels.gmax
      && blue >= levels.bmin
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}
