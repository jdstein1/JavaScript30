// cache dom objects.
const body = document.querySelector('body');
const images = document.querySelectorAll('.slide-in');

// give each image an ID for logging purposes.
let count = 0;
images.forEach(img => {
  count++;
  img.id = count;
});

// return to top of page on refresh/load & clear console.
window.onload = function() {
 setTimeout (function () {
  scrollTo(0,0);
  console.clear();
 }, 100); //100ms for example
}

// check if image is in view or not and show/hide accordingly.
function checkSlide(e) {
  images.forEach(img => {
    // console.group('image ',img.id)
    const imageMidpoint = (img.offsetTop+(img.clientHeight/2));
    const isInView = (imageMidpoint < window.scrollY+window.innerHeight);
    // console.log('isInView: ', isInView);
    const isOutOfView = (imageMidpoint < window.scrollY);
    // console.log('isOutOfView: ', isOutOfView);
    if (isInView && !isOutOfView) {
      // show when in view AND not out of view
      img.classList.add('active');
    } else {
      // hide when NOT in view
      img.classList.remove('active');
    }
    // console.groupEnd();
  });
}

// listen for scroll event according to interval given to 
// debounce function.
window.addEventListener('scroll',debounce(checkSlide,10));
