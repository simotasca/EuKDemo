import {
  Scene,
  PerspectiveCamera,
  PointLight,
  AmbientLight,
  sRGBEncoding,
  ACESFilmicToneMapping
} from 'three'
import FPS from './fps.js'

let rendManager = null

const canvSelector = '#main-canvas'
const prodotti = ['bartenura', 'petti', 'levante']

//// CAMERA //////////////////////////////////////////////
const near = 0.1
const far = 2500
const fov = 30
const aspect = window.innerWidth / window.innerHeight
const camera = new PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 0, 14)
camera.lookAt(0, 0, 0)

//// SCENE ///////////////////////////////////////////////
const scene = new Scene()

//// LIGHTS //////////////////////////////////////////////
const light = new PointLight('white', 0.7, 100)
light.position.set(7, 5, 5)
scene.add(light)

scene.add(new AmbientLight('white', 0.4)) // 0.2

//// MODELS //////////////////////////////////////////////
let currentProd = 0
let importedProds = []

async function addProduct(name) {
  const imported = await import(`./prodotti/${name}.js`)
  importedProds.push(imported)
  if (opt.level == 0) {
    addProductImage(importedProds.length - 1, true)
    return
  }

  scene.add(imported.model)
  await new Promise(resolve => {
    imported.loadingManager.onLoad = () => {
      resolve()
    }
    imported.init()
  })
}

//// ANIMATION ///////////////////////////////////////////
function animation(time) {
  importedProds[currentProd]?.animation && importedProds[currentProd].animation(time)
}

//// OPTIMIZATION ////////////////////////////////////////

let levels = null
let opt = {
  lastTime: null,
  checkDelta: 2000,
  finished: false,
  level: 1,
  lastLevel: null
}

let fps = new FPS(500)

function optimization(time) {
  fps.calculate(time)
  // dopo due secondi di assestamento fps iniziano dei check periodici
  if (!opt.finished && time > 2000) {

    if (!opt.lastTime) opt.lastTime = time
    else if (time - opt.lastTime > opt.checkDelta * 1.2) {

      // uso un delta maggiore di quello degli fps per assicurarmi che sia avvenuto il ricalcolo degli fps
      opt.lastTime = time
      if (fps.current < 45) { // 45
        levels[opt.level].reduce()
        opt.lastLevel = opt.level
        opt.level--
        console.log("reduce: ", fps.current)
        if (opt.level == 0 || opt.lastLevel == opt.level) {
          opt.finished = true
        }
      } else if (fps.current > 55) {
        if (opt.lastLevel == opt.level + 1) {
          // se il precedente livello era maggiore è inutile reincrementare
          opt.finished = true
        } else {
          console.log("increase: ", fps.current)
          levels[opt.level].increase()
          opt.lastLevel = opt.level
          opt.level++
        }
        if (opt.level == levels.length - 1) {
          opt.finished = true
        }
      } else {
        opt.finished = true
      }
    }

  }

  if (opt.finished) {
    // A COMPLETAMENTO OTTIMIZZAZIONE
    // controllo sui livelli e setting impostazioni di rendering e animazione
    if (opt.level == 0) {
      rendManager.removeRenderer(canvSelector) +
        addProductImage(0, false)
    } else {
      rendManager.setOnRender(canvSelector, animation)
    }
  }
}

function addProductImage(prod, hidden) {
  // if(document.querySelector(``))
  let container = document.querySelector('#product-imgs')
  let img = document.createElement('img')
  img.src = importedProds[prod].imageSrc
  img.className = 'product-img'
  img.className += hidden ? ' product-img--hidden' : ''
  img.id = `product-img-${prod}`
  img.alt = ""
  container.appendChild(img)
  // <img id="product-img-0" class="product-img" src="./resources/img/index/bicchiere.png" alt=""></img>
}

//// MAIN ////////////////////////////////////////////////
function manageRenderer(renderer) {
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.outputEncoding = sRGBEncoding
  // renderer.setPixelRatio(1)
}

const rendererOptions = {
  alpha: true,
  antialias: true
}

function start(rManager) {
  // RENDERING
  rendManager = rManager
  rendManager.addRenderer(canvSelector, rendererOptions, manageRenderer)
  rendManager.setScene(canvSelector, scene)
  rendManager.setCamera(canvSelector, camera)
  // OPTIMIZATION
  addProduct(prodotti[0]).then(() => {
    let optProduct = importedProds[0]
    optProduct.loadingManager.onLoad = async () => {
      // await 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000))

      levels = optProduct.optimizationLevels
      rendManager.setOnRender(canvSelector, time => optimization(time))
      rendManager.startRendering(canvSelector)
    }
    optProduct.init()
  })
}

function start_(rManager) {
  rendManager = rManager
  rendManager.addRenderer(canvSelector, rendererOptions, manageRenderer)
  rendManager.setScene(canvSelector, scene)
  rendManager.setCamera(canvSelector, camera)
  addProduct(prodotti[1]).then(() => {
    importedProds[0].model.visible = true
    setTimeout(() => rendManager.startRendering(canvSelector), 5)
    rendManager.setOnRender(canvSelector, time => importedProds[0].animation(time))

  })
}

function transitionAnimation(last, curr) {
  let currModel = importedProds[curr].model
  let lastModel = importedProds[last].model
  let lastBottle = importedProds[last].bottle

  currModel.visible = true
  currModel.position.y = 6
  document.querySelector(`#hero-${curr}`).closest(".main-canvas-container").classList.remove("p-evt-none")
  document.querySelector(`#product-side-img-${curr}`).classList.remove("product-img--hidden")
  if (opt.level == 0) document.querySelector(`#product-img-${curr}`).classList.remove("product-img--hidden")

  let timeline = gsap.timeline({
    onComplete: () => {
      lastModel.visible = false
      document.querySelector(`#hero-${last}`).closest(".main-canvas-container")
      document.querySelector(`#product-side-img-${last}`).classList.add("product-img--hidden")
      if (opt.level == 0) document.querySelector(`#product-img-${last}`).classList.add("product-img--hidden")
    }
  })

  if (opt.level == 0) {
    timeline.to(`#product-img-${last}`, { y: '+80%', duration: 1 }, 1)
    timeline.fromTo(`#product-img-${curr}`, { y: '-80%' }, { y: 0, duration: 1 }, 1)
  } else {
    timeline
      .fromTo(lastBottle.rotation, { y: 0 }, { y: -Math.PI * 40, duration: 2, ease: 'Power3.easeIn' }, 0)
      .to(lastModel.position, { y: -6, duration: 1 }, 1)
      .to(currModel.position, { y: 0, duration: 1 }, 1)
  }

  timeline
    .fromTo(`#hero-${last}`, { rotationY: 0 }, { rotationY: -90, duration: 1, ease: 'Power1.easeIn' }, 0)
    .fromTo('#firma-rav-1', { rotationY: 0 }, { rotationY: -90, duration: 1, ease: 'Power1.easeIn' }, 0)
    .fromTo(`#hero-${curr}`, { rotationY: 90 }, { rotationY: 0, duration: 1, ease: 'Power1.easeOut' }, 1)
    .fromTo('#firma-rav-2', { rotationY: 90 }, { rotationY: 0, duration: 1, ease: 'Power1.easeOut' }, 1)

    .fromTo(`#product-side-img-${last}`, { y: '0' }, { y: '80%', duration: 1 }, 1)
    .fromTo(`#product-side-img-${curr}`, { y: '-80%', x: '+=100' }, { y: '0', x: '-=100', duration: 1 }, 1)

}

async function nextProduct() {
  if (prodotti.length <= 1 || !opt.finished) return

  let lastProduct = currentProd

  currentProd++

  if (currentProd == prodotti.length)
    currentProd = 0

  if (currentProd > importedProds.length - 1)
    await addProduct(prodotti[currentProd])

  await new Promise(resolve => setTimeout(resolve, 1000))

  transitionAnimation(lastProduct, currentProd)
}

//// EXPORTS /////////////////////////////////////////////
window.nextProduct = nextProduct
export { start }