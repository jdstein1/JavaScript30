/* fx.js */
function fxChromaKey(data) {
  // console.log('START fxChromaKey');
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

function fxSplit(data,nums) {
  // console.log('START fxSplit');
  for (let i = 0; i < data.data.length; i+=4) {
    data.data[i+nums[1]] = data.data[i+0]; // r
    data.data[i+nums[2]] = data.data[i+1]; // g
    data.data[i+nums[3]] = data.data[i+2]; // b
  }
  return data;
}

function fxRGB(data,effect) {
  // console.log('START fxRGB',effect);
  for (let i = 0; i < data.data.length; i+=4) {
    data.data[i+0] += (effect==='red') ? 150 : -50; // r
    data.data[i+1] += (effect==='green') ? 150 : -50; // g
    data.data[i+2] += (effect==='blue') ? 150 : -50; // b
  }
  return data;
}

function fxPixelate(data,resolution) {
  // console.log('START fxPixelate',resolution);
  for (let i = 0; i < data.data.length; i+=4) {
  }
  return data;
}
