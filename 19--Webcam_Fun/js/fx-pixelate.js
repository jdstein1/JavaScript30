/* fx-pixelate.js */
console.log('fx-pixelate.js READY!');
/**
 * this effect function takes CANVAS element ImageData (Uint8Array) with a data 
 * property that holds RGBA information in an Uint8ClampedArray...
 */
/**
 * [fFxPixelate description]
 * @param  {big array} data - The pixels.
 * @param  {number} res - Resolution of the pixels: 1 = 1:1, 2 = 1:2, 3 = 1:3, etc.
 * @return {big array} - The modified pixels.
 */
function fFxPixelate(pixels,res) {
  // console.group('START fFxPixelate',res);

  const newLength = pixels.data.length/(res*res);
  // console.log('newLength: ', newLength);
  const newHeight = Math.floor(pixels.height/res);
  // console.log('newHeight: ', newHeight);
  const newWidth = Math.floor(pixels.width/res);
  // console.log('newWidth: ', newWidth);

  let newData = [];
  for (let i = 0; i < pixels.data.length; i+=4) {
    if ( (i % (4*res*res)) === 0 ) {
      // console.log('slicing');
      newData.push(pixels.data[i]);
      newData.push(pixels.data[i+1]);
      newData.push(pixels.data[i+2]);
      newData.push(pixels.data[i+3]);
    } else {
      // console.log('NOT slicing');
    }
  }
  // console.log('newData: ',newData.length);
  /**
   * need to disable canvas scaling and centering in order to properly 
   * calculate the canvas dimaensions and length of the ImageData array
   */
  // console.dir(Uint8ClampedArray.from(newData));
  // pixels.data = new Uint8ClampedArray(newData);
  /**
   * the new array needs to be sorted differently in order to layout the image 
   * in a natural, 2D way...
   */
  // debugger;
  newData.sort((a,b)=>{
    // console.log('a: ', a);
    // console.log('b: ', b);
  });
  newData = Uint8ClampedArray.from(newData);
  // console.dir(newData);
  // console.groupEnd();
  let newImageData = new ImageData(newData, newWidth, newHeight);
  return newImageData;
}
