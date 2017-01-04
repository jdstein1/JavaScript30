// console.log('scripts');
const body = document.querySelector('body');
const images = document.querySelectorAll('.slide-in');
console.log(images);

body.scrollTop = 0;

// images.forEach(img => img.classList.add('active'));

function checkSlide(e) {
  console.count(e);
  // console.log('window.scrollY: ', window.scrollY);
  // console.log('window.innerHeight: ', window.innerHeight);
  // console.log('body.clientHeight: ', body.clientHeight);
  images.forEach(img => {
      // console.group(img.src);
      // console.log('image midpoint', (img.offsetTop+(img.clientHeight/4)));
      // console.log('current scroll point', (window.scrollY+window.innerHeight));
      // console.groupEnd();
    // console.log('img.offsetTop: ',img.offsetTop);
    // console.log('img.clientHeight: ',img.clientHeight);
    if ((img.offsetTop+(img.clientHeight/4)) < (window.scrollY+window.innerHeight)) {
      console.info(img.src+' is IN VIEW!');
      img.classList.add('active');
    } else {
    }
  });
}

// window.addEventListener('scroll',checkSlide);
window.addEventListener('scroll',debounce(checkSlide));