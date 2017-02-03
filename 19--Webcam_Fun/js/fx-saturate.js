/* fx-saturate.js */
console.log('fx-saturate.js READY!');
/**
 * this effect function takes CANVAS element ImageData (Uint8Array) with a data 
 * property that holds RGBA information in an Uint8ClampedArray...
 */

/**
 * [fFxSaturate description]
 * @param  {big array} data - The pixels.
 * @param  {number} saturation - How saturated the video should be: 0 = monochrome, 100 = normal color, 200 = super color.
 * @return {big array} - The modified pixels.
 */
function fFxSaturate(pixels,nums) {
  // console.log('START fFxSaturate',nums);
  for (let i = 0; i < pixels.data.length; i+=4) {
    /* add color values together to get average */
    const avg = (pixels.data[i] + pixels.data[i+1] + pixels.data[i+2])/3;
    /* apply average to R,G, and B values of each pixel */
    pixels.data[i] = (avg*nums[0])+(pixels.data[i]*nums[1]); // r
    pixels.data[i+1] = (avg*nums[0])+(pixels.data[i+1]*nums[1]); // g
    pixels.data[i+2] = (avg*nums[0])+(pixels.data[i+2]*nums[1]); // b
  }
  return pixels;
}
