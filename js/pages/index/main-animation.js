let currentProduct = 0
let totProducts = 2
let animating = false

let timout

function settalo() {
  timout = setTimeout(nextProduct, 5 * 1000)
}

function clear() {
  clearTimeout(timout)
  timout = null
}

settalo()

function nextProduct() {
  if (animating) return

  if (window.scrollY > 300) {
    clear()
    settalo()
    return
  }

  if (timout) clear()


  animating = true
  let lastProduct = currentProduct
  currentProduct++
  if (currentProduct == totProducts)
    currentProduct = 0

  console.log(currentProduct, lastProduct)

  document.querySelector(`#product-img-${currentProduct}`).classList.remove('d-none')
  document.querySelector(`#product-side-img-${currentProduct}`).classList.remove('d-none')
  document.querySelector(`#hero-${currentProduct}`).classList.remove('d-none')
  document.querySelector(`#firma-rav-${currentProduct}`).classList.remove('d-none')

  document.querySelector(`#ellipse-${currentProduct}`).classList.remove('d-none')
  document.querySelector(`#ellipse-${lastProduct}`).classList.remove('main-ellipse')
  document.querySelector(`#ellipse-${currentProduct}`).classList.add('main-ellipse')


  let timeline = gsap.timeline({
    onComplete: () => {
      document.querySelector(`#product-img-${lastProduct}`).classList.add('d-none')
      document.querySelector(`#product-side-img-${lastProduct}`).classList.add('d-none')
      document.querySelector(`#hero-${lastProduct}`).classList.add('d-none')
      document.querySelector(`#firma-rav-${lastProduct}`).classList.add('d-none')
      document.querySelector(`#ellipse-${lastProduct}`).classList.add('d-none')
      animating = false
      !timout && settalo()
    }
  })

  timeline
    .fromTo(`#product-img-${lastProduct}`, { x: 0, rotation: 0 }, { x: '-100%', rotation: -10, duration: 1, ease: "Power2.easeIn" }, 0.4)
    .fromTo(`#product-img-${currentProduct}`, { x: '100%', rotation: 10 }, { x: 0, rotation: 0, duration: 1, ease: "Power2.easeOut" }, 1.1)
    
    .fromTo(`#product-side-img-${lastProduct}`, { x: 0, rotation: 0 }, { x: '-100%', duration: 1, ease: "Power2.easeIn" }, 0.5)
    .fromTo(`#product-side-img-${currentProduct}`, { x: '100%' }, { x: 0, rotation: 0, duration: 1, ease: "Power2.easeOut" }, 1.2)
   
    .fromTo(`#firma-rav-${lastProduct}`, { x: 0, autoAlpha: 1 }, { x: '-50', autoAlpha: 0, duration: 0.7 }, 0.3)
    .fromTo(`#firma-rav-${currentProduct}`, { x: "50", autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7 }, 1.25)

    .fromTo(`#hero-${lastProduct}`, { x: 0, autoAlpha: 1 }, { x: '-50', autoAlpha: 0, duration: 0.7 }, 0.2)
    .fromTo(`#hero-${currentProduct}`, { x: "50", autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7 }, 1.15)

    .fromTo(`#ellipse-${currentProduct}`, { x: '100%' }, { x: 0, duration: 1 }, 0.9)
  // .fromTo('#ellipse-1', { y: '100%' }, { y: 0, duration: 1 }, 0)
  // .fromTo('#product-img-1', { y: '100%' }, { y: 0, duration: 1 }, 0.1)
}