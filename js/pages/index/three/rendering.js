import RenderManager from "./render-manager.js";
// import { start as startProdotti } from './prodotti.js'
import { start as startMappa } from './mappa.js'
// import mappa from './mappa.js'

const rManager = new RenderManager()

// startProdotti(rManager)
startMappa(rManager)

//// RENDERING ON DEMAND //////////////////////////////////////////////
function renderingOnDemand() {
  rManager.foreach(renderer => {
    let canvRect = renderer.domElement.getBoundingClientRect()
    let sel = '#' + renderer.domElement.id
    if (canvRect.bottom < 0) rManager.stopRendering(sel)
    else rManager.startRendering(sel)
  })
}

window.addEventListener('load', renderingOnDemand)
window.addEventListener('scroll', renderingOnDemand)

