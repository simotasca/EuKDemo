import scene from './mappa/scene.js'
import camera from './mappa/camera.js'
import initScrollAnimation, { onRenderScrollAnimation } from './mappa/scrollAnimation.js'
import { onRenderAziende } from './mappa/aziende.js'
import { onRenderLatiLongiPoints } from './mappa/latiLongi.js'

const canvasSelector = '#map-canvas'

initScrollAnimation()

function animation(time) {
  onRenderScrollAnimation(time)
  onRenderAziende(time)
  onRenderLatiLongiPoints(time)
}

function start(rManager) {
  // RENDERING
  rManager.addRenderer(canvasSelector, { alpha: true })
  rManager.setScene(canvasSelector, scene)
  rManager.setCamera(canvasSelector, camera)
  rManager.setOnRender(canvasSelector, time => animation(time))
}

export { canvasSelector, start }