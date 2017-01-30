/**
 * [fMirror description]
 * @param  {big array} data - The pixels.
 * @return {big array}      The modified pixels.
 */
function fMirror(context) {
  console.group('START fMirror: ',context);

  context.drawImage(video,0,0,vWidth,vHeight);
  let pixels = context.getImageData(0,0,vWidth,vHeight);
  console.log('pixels:', pixels);

  /**
   * in retrospect, reversing the array does not work b/c the RGBA sequence 
   * values get applies backwards as ABGR.  in order to preserve the color and transparency while reversing the image, I will need to reverse the values in blocks of 4...
   */

  // pixels.data = pixels.data.map((px)=>{
    // console.log('test',index);
  // });
  // debugger;

  // for (let i = 0; i < pixels.data.length; i+=4) {
  //   var sub = pixels.data.subarray(0,4);
  //   console.log('sub: ', sub);
  //   console.log('pixels.data:', pixels.data);
  //   debugger;
  // }
  console.groupEnd();
  return pixels;
}
