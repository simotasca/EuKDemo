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

  document.querySelector(`#product-${currentProduct}`).classList.remove('d-none')
  document.querySelector(`#side-${currentProduct}`).classList.remove('d-none')
  document.querySelector(`#firma-${currentProduct}`).classList.remove('d-none')

  document.querySelector(`#ellipse-${currentProduct}`).classList.remove('d-none')
  document.querySelector(`#ellipse-${lastProduct}`).classList.remove('ellipse-bg--top')
  document.querySelector(`#ellipse-${currentProduct}`).classList.add('ellipse-bg--top')


  let timeline = gsap.timeline({
    onComplete: () => {
      document.querySelector(`#product-${lastProduct}`).classList.add('d-none')
      document.querySelector(`#side-${lastProduct}`).classList.add('d-none')
      document.querySelector(`#firma-${lastProduct}`).classList.add('d-none')
      document.querySelector(`#ellipse-${lastProduct}`).classList.add('d-none')
      animating = false
      !timout && settalo()
    }
  })

  if (window.innerWidth >= 475) {
    timeline
      .fromTo(`#product-${lastProduct}`, { x: 0, rotation: 0 }, { x: '-100%', rotation: -10, duration: 1, ease: "Power2.easeIn" }, 0.4)
      .fromTo(`#product-${currentProduct}`, { x: '100%', rotation: 10 }, { x: 0, rotation: 0, duration: 1, ease: "Power2.easeOut" }, 1.1)

      .fromTo(`#side-${lastProduct}`, { x: 0, rotation: 0 }, { x: '-100%', duration: 1, ease: "Power2.easeIn" }, 0.5)
      .fromTo(`#side-${currentProduct}`, { x: '100%' }, { x: 0, rotation: 0, duration: 1, ease: "Power2.easeOut" }, 1.2)

      .fromTo(`#firma-${lastProduct}`, { x: 0, autoAlpha: 1 }, { x: '-50', autoAlpha: 0, duration: 0.7 }, 0.3)
      .fromTo(`#firma-${currentProduct}`, { x: "50", autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7 }, 1.25)

      .fromTo(`#hero-${lastProduct}`, { x: 0, autoAlpha: 1 }, { x: '-50', autoAlpha: 0, duration: 0.7 }, 0.2)
      .add(() => {
        // va fatto qui perchè uso la position relative
        document.querySelector(`#hero-${currentProduct}`).classList.remove('d-none')
        document.querySelector(`#hero-${lastProduct}`).classList.add('d-none')
      }, 1)
      .fromTo(`#hero-${currentProduct}`, { x: "50", autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7 }, 1.15)

      .fromTo(`#ellipse-${currentProduct}`, { x: '100%' }, { x: 0, duration: 1 }, 0.9)

    return
  }



  // timeline
  //   .fromTo(`#hero-${lastProduct}`, { x: 0, autoAlpha: 1 }, { x: '-20', autoAlpha: 0, duration: 0.4 }, 0.2)
  //   .fromTo(`#product-group-${lastProduct}`, { x: 0 }, { x: '-100%', duration: 0.7, ease: "Power2.easeIn" }, '>')
  //   .add(() => {
  //     // va fatto qui perchè uso la position relative
  //     document.querySelector(`#hero-${currentProduct}`).classList.remove('d-none')
  //     document.querySelector(`#hero-${lastProduct}`).classList.add('d-none')
  //   }, '>')
  //   .fromTo(`#hero-${currentProduct}`, { x: "20", autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7 }, '>')
  //   .fromTo(`#product-group-${currentProduct}`, { x: '100%' }, { x: 0, duration: 0.7, ease: "Power2.easeOut" }, 1.9)
  //   .fromTo(`#ellipse-${currentProduct}`, { x: '100%' }, { x: 0, duration: 2 }, 0.9)


}