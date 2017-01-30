/* fx.js */
console.log('fx.js READY!');
/**
 * check if each pixel's color value falls within ranges set 
 * by inputs.  if it does, drop alpha value to 0 to hide pixel.
 * @param  {big array} data - The pixels.
 * @return {big array}      The modified pixels.
 */
function fFxChromaKey(uint8) {
  // console.log('START fFxChromaKey');
  // create empty array of min & max values
  const levels = {};
  // push values to array of min & max values
  document.querySelectorAll('#ctrl_fx_chroma input').forEach((input) => {
    levels[input.name] = input.value;
  });
  // console.log(levels);
  // debugger;
  for (let i = 0; i < uint8.data.length; i+=4) {
    // put values into vars
    red = uint8.data[i+0]; // r
    green = uint8.data[i+1]; // g
    blue = uint8.data[i+2]; // b
    alpha = uint8.data[i+3]; // a

    // check if values are within ranges
    if (red >= levels.rmin
      && red <= levels.rmax
      && green >= levels.gmin
      && green <= levels.gmax
      && blue >= levels.bmin
      && blue <= levels.bmax) {
      // take it out!
      uint8.data[i + 3] = 0;
    }
  }
  return uint8;
}

/**
 * Offset the R, G, and B values of each pixel to another pixel 
 * location, thereby splitting the R, G, and B channels into 
 * distinctly separate layers.
 * @param  {big array} data - The pixels.
 * @param  {array} nums - Integers used to shift each R, G, and B value.
 * @return {big array}      The modified pixels.
 */
function fFxChannelSplit(uint8,nums) {
  // console.log('START fFxChannelSplit');
  for (let i = 0; i < uint8.data.length; i+=4) {
    uint8.data[i+nums[0]] = uint8.data[i+0]; // r
    uint8.data[i+nums[1]] = uint8.data[i+1]; // g
    uint8.data[i+nums[2]] = uint8.data[i+2]; // b
  }
  return uint8;
}

/**
 * Increase or decrease value of each pixels R, G, and B values to 
 * create a monochromatic picture.
 * @param  {big array} data - The pixels.
 * @param  {array} nums - Integers used to shift each R, G, and B value.
 * @return {big array}      The modified pixels.
 */
function fFxColorize(uint8,nums) {
  // console.log('START fFxRGB',nums);
  for (let i = 0; i < uint8.data.length; i+=4) {
    uint8.data[i+0] += nums[0]; // r
    uint8.data[i+1] += nums[1]; // g
    uint8.data[i+2] += nums[2]; // b
  }
  return uint8;
}

/**
 * [fFxPixelate description]
 * @param  {big array} data - The pixels.
 * @param  {number} res - Resolution of the pixels: 1 = 1:1, 2 = 1:2, 3 = 1:3, etc.
 * @return {big array}      The modified pixels.
 */
function fFxPixelate(uint8,res) {
  // console.log('START fFxPixelate',res);
  for (let i = 0; i < uint8.data.length; i+=4) {
  }
  return uint8;
}

/**
 * [fFxSaturate description]
 * @param  {big array} data - The pixels.
 * @param  {number} saturation - How saturated the video should be: 0 = monochrome, 100 = normal color, 200 = super color.
 * @return {big array}      The modified pixels.
 */
function fFxSaturate(uint8,nums) {
  // console.log('START fFxSaturate',nums);
  for (let i = 0; i < uint8.data.length; i+=4) {
    /* add color values together to get average */
    const avg = (uint8.data[i+0] + uint8.data[i+1] + uint8.data[i+2])/3;
    /* apply average to R,G, and B values of each pixel */
    uint8.data[i+0] = (avg*nums[0])+(uint8.data[i+0]*nums[1]); // r
    uint8.data[i+1] = (avg*nums[0])+(uint8.data[i+1]*nums[1]); // g
    uint8.data[i+2] = (avg*nums[0])+(uint8.data[i+2]*nums[1]); // b
  }
  return uint8;
}
