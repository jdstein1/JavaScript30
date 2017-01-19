/* fx.js */
console.log('fx.js READY!');
/**
 * check if each pixel's color value falls within ranges set 
 * by inputs.  if it does, drop alpha value to 0 to hide pixel.
 * @param  {big array} data - The pixels.
 * @return {big array}      The modified pixels.
 */
function fFxChromaKey(data) {
  // console.log('START fFxChromaKey');
  const levels = {};
  document.querySelectorAll('#table-chroma input').forEach((input) => {
    levels[input.name] = input.value;
  });
  // console.log(levels);
  // debugger;
  for (let i = 0; i < data.data.length; i+=4) {
    // put values into vars
    red = data.data[i+0]; // r
    green = data.data[i+1]; // g
    blue = data.data[i+2]; // b
    alpha = data.data[i+3]; // a

    // check if values are within ranges
    if (red >= levels.rmin
      && red <= levels.rmax
      && green >= levels.gmin
      && green <= levels.gmax
      && blue >= levels.bmin
      && blue <= levels.bmax) {
      // take it out!
      data.data[i + 3] = 0;
    }
  }
  return data;
}

/**
 * Offset the R, G, and B values of each pixel to another pixel 
 * location, thereby splitting the R, G, and B channels into 
 * distinctly separate layers.
 * @param  {big array} data - The pixels.
 * @param  {array} nums - Integers used to shift each R, G, and B value.
 * @return {big array}      The modified pixels.
 */
function fFxSplit(data,nums) {
  // console.log('START fFxSplit');
  for (let i = 0; i < data.data.length; i+=4) {
    data.data[i+nums[0]] = data.data[i+0]; // r
    data.data[i+nums[1]] = data.data[i+1]; // g
    data.data[i+nums[2]] = data.data[i+2]; // b
  }
  return data;
}

/**
 * Increase or decrease value of each pixels R, G, and B values to 
 * create a monochromatic picture.
 * @param  {big array} data - The pixels.
 * @param  {array} nums - Integers used to shift each R, G, and B value.
 * @return {big array}      The modified pixels.
 */
function fFxColorize(data,nums) {
  // console.log('START fFxRGB',nums);
  for (let i = 0; i < data.data.length; i+=4) {
    data.data[i+0] += nums[0]; // r
    data.data[i+1] += nums[1]; // g
    data.data[i+2] += nums[2]; // b
  }
  return data;
}

/**
 * [fFxPixelate description]
 * @param  {big array} data - The pixels.
 * @param  {number} resolution - Resolution of the pixels. 1 = full res.  2 = half res.
 * @return {big array}      The modified pixels.
 */
function fFxPixelate(data,resolution) {
  // console.log('START fFxPixelate',resolution);
  for (let i = 0; i < data.data.length; i+=4) {
  }
  return data;
}
