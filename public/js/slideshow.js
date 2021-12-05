let slideshows = document.querySelectorAll('.slideshow');

for (let slideshow of slideshows) {
  let slides = slideshow.querySelectorAll(".slideshow__items")[0];
  
  let slidesCopy = document.createElement('div');
  slidesCopy.className = 'slideshow__items slideshow__items--copy';
  slidesCopy.innerHTML = slides.innerHTML;
  slideshow.appendChild(slidesCopy);
  
  slides.style.animationName= "slide";
  slidesCopy.style.animationName= "slide-1";
}