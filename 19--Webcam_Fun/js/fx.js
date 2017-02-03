/* fx.js */
console.log('fx.js READY!');

/**
 * Uint8ClampedArray
 */

/**
 * check if each pixel's color value falls within ranges set 
 * by inputs.  if it does, drop alpha value to 0 to hide pixel.
 * @param  {big array} data - The pixels.
 * @return {big array} - The modified pixels.
 */
function fFxChromaKey(array255) {
  // console.log('START fFxChromaKey');
  // create empty array of min & max values
  const levels = {};
  // push values to array of min & max values
  document.querySelectorAll('#ctrl_fx_chroma input').forEach((input) => {
    levels[input.name] = input.value;
  });
  // console.log(levels);
  // debugger;
  for (let i = 0; i < array255.data.length; i+=4) {
    // put values into vars
    red = array255.data[i+0]; // r
    green = array255.data[i+1]; // g
    blue = array255.data[i+2]; // b
    alpha = array255.data[i+3]; // a

    // check if values are within ranges
    if (red >= levels.rmin
      && red <= levels.rmax
      && green >= levels.gmin
      && green <= levels.gmax
      && blue >= levels.bmin
      && blue <= levels.bmax) {
      // take it out!
      array255.data[i + 3] = 0;
    }
  }
  return array255;
}

/**
 * Offset the R, G, and B values of each pixel to another pixel 
 * location, thereby splitting the R, G, and B channels into 
 * distinctly separate layers.
 * @param  {big array} data - The pixels.
 * @param  {array} nums - Integers used to shift each R, G, and B value.
 * @return {big array} - The modified pixels.
 */
function fFxChannelSplit(array255,nums) {
  // console.log('START fFxChannelSplit');
  for (let i = 0; i < array255.data.length; i+=4) {
    array255.data[i+nums[0]] = array255.data[i+0]; // r
    array255.data[i+nums[1]] = array255.data[i+1]; // g
    array255.data[i+nums[2]] = array255.data[i+2]; // b
  }
  return array255;
}

/**
 * Increase or decrease value of each pixels R, G, and B values to 
 * create a monochromatic picture.
 * @param  {big array} data - The pixels.
 * @param  {array} nums - Integers used to shift each R, G, and B value.
 * @return {big array} - The modified pixels.
 */
function fFxColorize(array255,nums) {
  // console.log('START fFxRGB',nums);
  for (let i = 0; i < array255.data.length; i+=4) {
    array255.data[i+0] += nums[0]; // r
    array255.data[i+1] += nums[1]; // g
    array255.data[i+2] += nums[2]; // b
  }
  return array255;
}

/**
 * [fFxSaturate description]
 * @param  {big array} data - The pixels.
 * @param  {number} saturation - How saturated the video should be: 0 = monochrome, 100 = normal color, 200 = super color.
 * @return {big array} - The modified pixels.
 */
function fFxSaturate(array255,nums) {
  // console.log('START fFxSaturate',nums);
  for (let i = 0; i < array255.data.length; i+=4) {
    /* add color values together to get average */
    const avg = (array255.data[i+0] + array255.data[i+1] + array255.data[i+2])/3;
    /* apply average to R,G, and B values of each pixel */
    array255.data[i+0] = (avg*nums[0])+(array255.data[i+0]*nums[1]); // r
    array255.data[i+1] = (avg*nums[0])+(array255.data[i+1]*nums[1]); // g
    array255.data[i+2] = (avg*nums[0])+(array255.data[i+2]*nums[1]); // b
  }
  return array255;
}

/**
 * [fFxInvert description]
 * @return {[type]} [description]
 */
function fFxInvert (array255) {
  for (var i = 0; i < array255.data.length; i += 4) {
    array255.data[i+0] = 255 - array255.data[i+0]; // red
    array255.data[i+1] = 255 - array255.data[i+1]; // green
    array255.data[i+2] = 255 - array255.data[i+2]; // blue
  }
  return array255;
};

/**
 * [fFxPixelate description]
 * @param  {big array} data - The pixels.
 * @param  {number} res - Resolution of the pixels: 1 = 1:1, 2 = 1:2, 3 = 1:3, etc.
 * @return {big array} - The modified pixels.
 */
function fFxPixelate(array255,res) {
  // console.group('START fFxPixelate',res);
  // console.log('array255: ',array255);
  // console.dir(array255.data);

  // console.log('array255.data.length: ',array255.data.length);
  // console.log('array255.height: ',array255.height);
  // console.log('array255.width: ',array255.width);


  const newLength = array255.data.length/res*res;
  // console.log('newLength: ', newLength);
  const newHeight = Math.floor(array255.height/res);
  // console.log('newHeight: ', newHeight);
  const newWidth = Math.floor(array255.width/res);
  // console.log('newWidth: ', newWidth);

  let newData = [];
  for (let i = 0; i < array255.data.length; i+=4) {
    if ( (i % (4*res*res)) === 0 ) {
      // console.log('i: ',i);
      // console.log('slicing');
      newData.push(array255.data[i]);
      newData.push(array255.data[i+1]);
      newData.push(array255.data[i+2]);
      newData.push(array255.data[i+3]);
    } else {
      // console.log('NOT slicing');
    }
  }
  // console.log('newData: ',newData);
  // console.log('newData.length: ',newData.length);
  /* need to disable canves scaling and centering in order to properly calculate the canvas dimaensions and length of the ImageData array */
  // console.log('newData.length/(4): ',newData.length/(4));
  // console.dir(Uint8ClampedArray.from(newData));
  // array255.data = new Uint8ClampedArray(newData);
  newData = Uint8ClampedArray.from(newData);
  // console.dir(newData);
  // console.groupEnd();
  // debugger;
  let newImageData = new ImageData(newData, newWidth, newHeight);
  // let newImageData = new ImageData(newData,1);
  return newImageData;
}
