/* fx.js */
function fxChromaKey(pixels) {
  const levels = {};
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });
  // console.log(levels);
  // debugger;
  for (let i = 0; i < pixels.data.length; i+=4) {
    // put values into vars
    red = pixels.data[i+0]; // r
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

function fxSplit(pixels,randoms) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i-randoms[1]] = pixels.data[i+0]; // r
    pixels.data[i+randoms[2]] = pixels.data[i+1]; // g
    pixels.data[i+randoms[3]] = pixels.data[i+2]; // b
  }
  return pixels;
}

function fxRGB(pixels,effect) {
  console.log('START fxRGB',effect);
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i+0] += (effect==='red') ? 150 : -50; // r
    pixels.data[i+1] += (effect==='green') ? 150 : -50; // g
    pixels.data[i+2] += (effect==='blue') ? 150 : -50; // b
  }
  return pixels;
}
