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

scene.add(new AmbientLight('white', 0.2))

//// MODELS //////////////////////////////////////////////
let currentProd = 0
let importedProds = []

async function addProduct(name) {
  const imported = await import(`./prodotti/${name}.js`)
  importedProds.push({
    ...imported,
    glassStartPos: imported.glass.position.x,
    glassStartRot: imported.glass.rotation.z
  })
  scene.add(imported.model)
}

function transitionAnimation(last, curr) {
  let currModel = importedProds[curr].model
  let lastModel = importedProds[last].model
  let lastGlass = importedProds[last].glass
  let lastBottle = importedProds[last].bottle
  let glassStartPos = importedProds[curr].glassStartPos
  let glassStartRot = importedProds[curr].glassStartRot

  currModel.position.y = 6
  currModel.visible = true

  // models[currentProd].position.y = 6
  // gsap.timeline()
  //   .to(models[lastProduct].position, {
  //     y: -4,
  //     duration: 0.4,
  //     ease: 'Power1.easeIn',
  //     onComplete: () => {
  //       models[lastProduct].visible = false
  //       models[currentProd].visible = true
  //     }
  //   })
  //   .to(models[currentProd].position, { y: 0, duration: 0.4, ease: 'Power1.easeInOut' }, '>')

  gsap.timeline({
    onComplete: () => {
      lastModel.visible = false
      lastGlass.position.x = glassStartPos
      lastGlass.rotation.z = glassStartRot
    }
  })
    .fromTo(lastBottle.rotation, { y: 0 }, { y: -Math.PI * 40, duration: 2, ease: 'Power3.easeIn' }, 0)
    .fromTo(lastGlass.position, { x: glassStartPos }, { x: glassStartPos + 4, duration: 2, ease: 'Power1.easeIn' }, 0)
    .fromTo(lastGlass.rotation, { z: glassStartRot }, { z: -Math.PI * 0.5, duration: 1.5, ease: 'Power3.easeIn' }, 0)
    .to(lastModel.position, { y: -6, duration: 1 }, 1)
    .to(currModel.position, { y: 0, duration: 1 }, 1)
    .fromTo('#hero1', { rotationY: 0 }, { rotationY: -90, duration: 1, ease: 'Power1.easeIn' }, 0)
    .fromTo('#firma-rav-1', { rotationY: 0 }, { rotationY: -90, duration: 1, ease: 'Power1.easeIn' }, 0)
    .fromTo('#hero2', { rotationY: 90 }, { rotationY: 0, duration: 1, ease: 'Power1.easeOut' }, 1)
    .fromTo('#firma-rav-2', { rotationY: 90 }, { rotationY: 0, duration: 1, ease: 'Power1.easeOut' }, 1)
}

async function nextProduct() {
  if (prodotti.length <= 1 || !opt.finished) return

  let lastProduct = currentProd

  currentProd++

  if (currentProd == prodotti.length)
    currentProd = 0

  if (currentProd > importedProds.length - 1)
    await addProduct(prodotti[currentProd])

  transitionAnimation(lastProduct, currentProd)
}

//// ANIMATION ///////////////////////////////////////////
function animation(time) {
  importedProds[currentProd]?.animation && importedProds[currentProd].animation(time)
}

//// OPTIMIZATION ////////////////////////////////////////

let levels = null
let opt = {
  lastTime: null,
  checkDelta: 1000,
  finished: false,
  level: 2,
  lastLevel: null
}

let fps = new FPS(500)

function optimization(time) {
  fps.calculate(time)
  console.log("optimization FPS: ", fps.current)
  // dopo due secondi di assestamento fps iniziano dei check periodici
  if (!opt.finished && time > 2000) {


    if (!opt.lastTime) opt.lastTime = time
    else if (time - opt.lastTime > opt.checkDelta * 1.2) {

      // uso un delta maggiore di quello degli fps per assicurarmi che sia avvenuto il ricalcolo degli fps
      opt.lastTime = time
      console.log("optimization FPS: ", fps.current)
      if (fps.current < 45) {
        levels[opt.level].reduce()
        opt.lastLevel = opt.level
        opt.level--
        console.log("reduce")
        if (opt.level == 0 || opt.lastLevel == opt.level) {
          opt.finished = true
        }
      } else if (fps.current > 55) {
        if (opt.lastLevel == opt.level + 1) {
          // se il precedente livello era maggiore è inutile reincrementare
          opt.finished = true
        } else {
          console.log("incerease")
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
    rendManager.setOnRender(canvSelector, animation)
  }
}

//// MAIN ////////////////////////////////////////////////
function manageRenderer(renderer) {
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.outputEncoding = sRGBEncoding
  renderer.setPixelRatio(1)
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
    optProduct.loadingManager.onLoad = () => {
      levels = optProduct.optimizationLevels
      rendManager.setOnRender(canvSelector, time => optimization(time))
      rendManager.startRendering(canvSelector)
    }
    optProduct.init()
  })
}

window.nextProduct = nextProduct
//// EXPORTS /////////////////////////////////////////////
export { start }