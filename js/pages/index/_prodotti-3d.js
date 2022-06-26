import * as THREE from 'three'
import RenderManager from './render-manager.js'

const canvasSelector = '#main-canvas'

const scene = new THREE.Scene()

//// CAMERA //////////////////////////////////////////////
const near = 0.1
const far = 2500
const fov = 30
const aspect = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 0, 14)
camera.lookAt(0, 0, 0)

//// LIGHTS //////////////////////////////////////////////
const light = new THREE.PointLight('white', 0.7, 100)
light.position.set(7, 5, 5)
scene.add(light)

scene.add(new THREE.AmbientLight('white', 0.2))

//// RENDERING //////////////////////////////////////////////
const rManager = new RenderManager()
rManager.addRenderer(canvasSelector, {
  alpha: true,
  antialias: true
})
const renderer = rManager.getRenderer(canvasSelector)
// renderer.setPixelRatio(1)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.outputEncoding = THREE.sRGBEncoding
rManager.setScene(canvasSelector, scene)
rManager.setCamera(canvasSelector, camera)
rManager.setOnRender(canvasSelector, time => {
  animations[currentProd] && animations[currentProd](time)
})
rManager.startRendering(canvasSelector)

// rendering on demand
window.addEventListener('scroll', () => {
  let canvRect = document.querySelector(canvasSelector).getBoundingClientRect()
  if (canvRect.bottom < canvRect.height * 0.25) {
    rManager.stopRendering(canvasSelector)
  } else {
    rManager.startRendering(canvasSelector)
  }
})

//// MODELS //////////////////////////////////////////////
let currentProd = 0
let prodotti = ['bartenura', 'petti', 'levante']
let models = []
let bottles = []
let glasses = []
let animations = []
let glassStartPos = []
let glassStartRot = []

async function addProduct(name) {
  const { model, animation, bottle, glass } = await import(`./prodotti/${name}.js`)
  models.push(model)
  animations.push(animation)
  bottles.push(bottle)
  glasses.push(glass)
  glassStartPos.push(glass.position.x)
  glassStartRot.push(glass.rotation.z)
  scene.add(model)
}

addProduct(prodotti[currentProd])

async function nexProduct() {
  let lastProduct = currentProd

  currentProd++

  if (currentProd == prodotti.length)
    currentProd = 0

  if (currentProd > models.length - 1)
    await addProduct(prodotti[currentProd])

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

  models[currentProd].position.y = 6
  models[currentProd].visible = true

  console.log(glassStartPos[currentProd])

  gsap.timeline({
    onComplete: () => {
      models[lastProduct].visible = false
      glasses[lastProduct].position.x = glassStartPos[currentProd]
      glasses[lastProduct].rotation.z = glassStartRot[currentProd]
    }
  })
    .fromTo(bottles[lastProduct].rotation, { y: 0 }, { y: -Math.PI * 40, duration: 2, ease: 'Power3.easeIn' }, 0)
    .fromTo(glasses[lastProduct].position, { x: glassStartPos[currentProd] }, { x: glassStartPos[currentProd] + 4, duration: 2, ease: 'Power1.easeIn' }, 0)
    .fromTo(glasses[lastProduct].rotation, { z: glassStartRot[currentProd] }, { z: -Math.PI * 0.5, duration: 1.5, ease: 'Power3.easeIn' }, 0)
    .to(models[lastProduct].position, { y: -6, duration: 1 }, 1)
    .to(models[currentProd].position, { y: 0, duration: 1 }, 1)
    .fromTo('#hero1', { rotationY: 0 }, { rotationY: -90, duration: 1, ease: 'Power1.easeIn' }, 0)
    .fromTo('#firma-rav-1', { rotationY: 0 }, { rotationY: -90, duration: 1, ease: 'Power1.easeIn' }, 0)
    .fromTo('#hero2', { rotationY: 90 }, { rotationY: 0, duration: 1, ease: 'Power1.easeOut' }, 1)
    .fromTo('#firma-rav-2', { rotationY: 90 }, { rotationY: 0, duration: 1, ease: 'Power1.easeOut' }, 1)

}

window.nexProduct = nexProduct

