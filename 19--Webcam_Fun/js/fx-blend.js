/* fx-blend.js */
console.log('fx-blend.js READY!');
/**
 * this effect function takes CANVAS element ImageData (Uint8Array) with a data 
 * property that holds RGBA information in an Uint8ClampedArray...
 */

/**
 * Increase or decrease value of each pixels R, G, and B values to 
 * create a monochromatic picture.
 * @param  {big array} data - The pixels.
 * @param  {array} nums - Integers used to shift each R, G, and B value.
 * @return {big array} - The modified pixels.
 */
function fFxBlend(pixels,num) {
  // console.log('START fFxRGB',nums);
  for (let i = 0; i < pixels.data.length; i+=4) {
    const avg = (pixels.data[i] + pixels.data[i+1] + pixels.data[i+2])/3;
    if (avg<127) {
      pixels.data[i+3] = avg+num; // num
    } else if (avg>127) {
      pixels.data[i+3] = avg-num; // num
    }
    // pixels.data[i+3] = num; // num
    // pixels.data[i+3] = avg; // avg
  }
  return pixels;
}
