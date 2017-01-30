/**
 * [fMirror description]
 * @param  {big array} data - The pixels.
 * @return {big array}      The modified pixels.
 */
function fMirror(pixels) {
  console.group('START fMirror');

  // console.log('pixels:', pixels);

  // pixels.data = pixels.data.reverse();

  /**
   * reversing the array does not work b/c the RGBA sequence values get 
   * applies backwards as ABGR.  in order to preserve the color and 
   * transparency while reversing the image, I will need to reverse the 
   * values in blocks of 4...
   */

  // pixels.data = pixels.data.map((px)=>{
    // console.log('test',index);
  // });
  // debugger;

  // console.log(pixels.data.length);
  // for (let i = 0; i < pixels.data.length; i+=4) {
  //   var sub = pixels.data.subarray(0,4);
  //   console.log('sub: ', sub);
  //   console.log('pixels.data:', pixels.data);
  //   debugger;
  // }


/**
 * https://jsbin.com/gufizu/edit?html,js,console
 */

/* THE FOLLOWING RESULTS IN AN ERROR.  SEE BELOW. */
var arr = pixels.data;
// console.log(arr);
arr = [...arr].reverse();
// console.log(rev);
var xyz = [];
for (var i = 0; i < arr.length; i+=3) {
  xyz.push(arr.slice(i,i+3));
}
// console.log(xyz);
var jkl = [...xyz].reverse();
// console.log(jkl);
arr = [].concat.apply([],jkl);
// console.log(arr);
pixels.data = arr;

/**
 * The above results in an error:
 * Uncaught RangeError: Maximum call stack size exceeded
    at fMirror (mirror.js:24)
    at videoFX (scripts.js:406)
    at setInterval (scripts.js:441)
 * Need different approach!
 * Maybe a CSS transform that flips the canvas...
 */

  console.groupEnd();
  return pixels;
}
