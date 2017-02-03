/* fx-channelsplit.js */
console.log('fx-channelsplit.js READY!');
/**
 * this effect function takes CANVAS element ImageData (Uint8Array) with a data 
 * property that holds RGBA information in an Uint8ClampedArray...
 */

/**
 * Offset the R, G, and B values of each pixel to another pixel 
 * location, thereby splitting the R, G, and B channels into 
 * distinctly separate layers.
 * @param  {big array} data - The pixels.
 * @param  {array} nums - Integers used to shift each R, G, and B value.
 * @return {big array} - The modified pixels.
 */
function fFxChannelSplit(pixels,nums) {
  // console.log('START fFxChannelSplit');
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i+nums[0]] = pixels.data[i]; // r
    pixels.data[i+nums[1]] = pixels.data[i+1]; // g
    pixels.data[i+nums[2]] = pixels.data[i+2]; // b
  }
  return pixels;
}
