/* fx-colorize.js */
console.log('fx-colorize.js READY!');
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
function fFxColorize(pixels,nums) {
  // console.log('START fFxRGB',nums);
  for (let i = 0; i < pixels.data.length; i+=4) {
    const avg = (pixels.data[i] + pixels.data[i+1] + pixels.data[i+2])/3;
    pixels.data[i] += nums[0]; // r
    pixels.data[i+1] += nums[1]; // g
    pixels.data[i+2] += nums[2]; // b
    pixels.data[i+3] = avg; // b
  }
  return pixels;
}
