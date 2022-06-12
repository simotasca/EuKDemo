let container = document.querySelector("#novita__list-container")
let carousel = document.querySelector("#novita__list")
let elements = document.querySelectorAll("novita-el")

let moveR = document.querySelector('#novita__move-r')
let moveL = document.querySelector('#novita__move-l')

let contW = null
let caW = null
let elWidth = null
let carGap = null

function reset() {
  contW = container.getBoundingClientRect().width
  caW = carousel.getBoundingClientRect().width
  elWidth = elements[0].getBoundingClientRect().width
  carGap = parseInt(window.getComputedStyle(carousel).gap.slice(0, -2))
}

reset()
moveL.classList.remove("hidden")
window.addEventListener("resize", reset)

moveR.addEventListener('click', () => {

  let nextEl = null
  let minR = null
  elements.forEach((el, idx) => {
    let elR = el.getBoundingClientRect().right
    if (container.getBoundingClientRect().right < elR) {
      if (!minR || elR < minR) {
        minR = elR
        nextEl = idx
      }
    }
  })

  if (nextEl) {
    let size = elWidth + carGap
    let translate = Math.min(caW - contW, size * nextEl)
    carousel.style.transform = `translateX(-${translate}px)`
  }
})

moveL.addEventListener('click', () => {
  let nextEl = null
  let minL = null

  elements.forEach((el, idx) => {
    let elL = el.getBoundingClientRect().left
    if (container.getBoundingClientRect().left > elL) {
      if (!minL || elL > minL) {
        minL = elL
        nextEl = idx
      }
    }
  })

  if (nextEl !== null) {
    let size = elWidth + carGap
    let translate = Math.max(0, size * (nextEl + 1) - contW)
    carousel.style.transform = `translateX(-${translate}px)`
  }
})

// let menu = document.querySelector('main-menu')
// let serchBar = document.querySelector('#search-bar')
// let input = serchBar.querySelector('input')
// let listaProdotti = document.querySelector('#lista-prodotti')

// let topOffset = menu.shadowRoot.querySelector('header').getBoundingClientRect().bottom + 20
// let startY = serchBar.getBoundingClientRect().top + window.scrollY

// document.addEventListener("scroll", () => {

//   let xScrollTarget = listaProdotti.getBoundingClientRect().top + window.scrollY - startY - 20
//   let xScrollProgress = Math.min(window.scrollY - startY + topOffset, xScrollTarget)
//   let xStart = window.innerWidth / 2 - serchBar.getBoundingClientRect().width / 2
//   let xEnd = document.querySelector("#novita").getBoundingClientRect().left + 10

//   let xDisp = xScrollProgress * (xEnd - xStart) / xScrollTarget
//   let yDisp = window.scrollY + topOffset - startY

//   if (window.scrollY > startY - topOffset) {
//     serchBar.style.transform = `translate(${xDisp}px, ${yDisp}px)`
//     input.classList.add('input--outline')
//   } else {
//     serchBar.style.transform = `translateY(${0}px)`
//     input.classList.remove('input--outline')
//   }
// })