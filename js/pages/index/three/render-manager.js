import * as THREE from '/three'
import Stats from 'Stats'

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

class RenderManager {

  // PROPERTIES

  renderers = []

  // PRIVATE METHODS

  #resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    // const pixelRatio = USE_DEVIXE_PX_RATIO ? window.devicePixelRatio : null
    const width = canvas.clientWidth // * (pixelRatio | 1)
    const height = canvas.clientHeight // * (pixelRatio | 1)
    const needResize = canvas.width !== width || canvas.height !== height

    if (needResize) renderer.setSize(width, height, false)

    return needResize
  }

  #getRenderer(selector) {
    return this.renderers.find(r => r.selector == selector)
  }

  #render(time, selector) {

    selector == "#main-canvas" && stats.begin()

    const rend = this.#getRenderer(selector)

    if (!rend) return

    if (rend.renderer && rend.scene && rend.camera && !rend.stopRendering) {

      if (this.#resizeRendererToDisplaySize(rend.renderer)) {
        const canvas = rend.renderer.domElement
        rend.camera.aspect = canvas.clientWidth / canvas.clientHeight
        rend.camera.updateProjectionMatrix()
      }

      rend.onRender && rend.onRender(time)

      rend.renderer.render(rend.scene, rend.camera)
      requestAnimationFrame(timestamp => this.#render(timestamp, selector))
    }

    selector == "#main-canvas" && stats.end()

  }

  // PUBLIC METHODS

  addRenderer(canvasSelector, options, callback) {
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector(canvasSelector),
      ...options
    })

    if (callback) callback(renderer)

    this.renderers.push({ selector: canvasSelector, renderer: renderer, stopRendering: true })
  }

  removeRenderer(selector) {
    this.stopRendering(selector)
    this.renderers = this.renderers.filter(r => r.selector != selector)
  }

  getRenderer(selector) {
    return this.#getRenderer(selector).renderer
  }

  setScene(selector, scene) {
    this.#getRenderer(selector).scene = scene
  }

  setCamera(selector, camera) {
    this.#getRenderer(selector).camera = camera
  }

  setOnRender(selector, callback) {
    this.#getRenderer(selector).onRender = callback
  }

  render(selector) {
    const rend = this.#getRenderer(selector)
    rend.renderer.render(rend.scene, rend.camera)
  }

  startRendering(selector) {
    let rend = this.#getRenderer(selector)
    if (rend.stopRendering) {
      rend.stopRendering = false
      requestAnimationFrame(timestamp => this.#render(timestamp, selector))
    }
  }

  stopRendering(selector) {
    this.#getRenderer(selector).stopRendering = true
  }

  foreach(callback) {
    this.renderers.forEach(renderer => callback(renderer.renderer) )
  }
}

export default RenderManager
