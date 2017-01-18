/* fx.js */
console.log('fx.js READY!');
function fFxChromaKey(data) {
  // console.log('START fFxChromaKey');
  const levels = {};
  document.querySelectorAll('#ctrl_fx--chroma input').forEach((input) => {
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

function fFxSplit(data,nums) {
  // console.log('START fFxSplit');
  for (let i = 0; i < data.data.length; i+=4) {
    data.data[i+nums[0]] = data.data[i+0]; // r
    data.data[i+nums[1]] = data.data[i+1]; // g
    data.data[i+nums[2]] = data.data[i+2]; // b
  }
  return data;
}

function fFxColorize(data,nums) {
  // console.log('START fFxRGB',nums);
  for (let i = 0; i < data.data.length; i+=4) {
    data.data[i+0] += nums[0]; // r
    data.data[i+1] += nums[1]; // g
    data.data[i+2] += nums[2]; // b
  }
  return data;
}

function fFxPixelate(data,resolution) {
  // console.log('START fFxPixelate',resolution);
  for (let i = 0; i < data.data.length; i+=4) {
  }
  return data;
}
