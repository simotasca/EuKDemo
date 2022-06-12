// import { gsap } from 'gsap'
// import { ScrollTrigger } from 'ScrollTrigger'

// gsap.registerPlugin(ScrollTrigger)

import { aura, ambientLight } from './scene.js'
import camera from './camera.js'
import { camPosObj, camRotObj, proseguiCamPos } from './camUtils.js'
import { points } from './latiLongi.js'
import { toScreenPosition } from './utils.js'
import { canvasSelector } from '../mappa.js'

let showAziende = false

function aziendeOn() {
  showAziende = true
}

function aziendeOff() {
  showAziende = false
  points.filter(p => p.isCloseToCenter).forEach(p => p.tween.reverse())
  points.forEach(p => p.isCloseToCenter = false)
}

const getBasicConfig = (duration = 1, easing = 'InOut') => {
  return { ease: 'Power1.ease' + easing, duration: duration }
}

function counterAnimation(elem, val, duration) {
  let tick = duration / val;
  function crescendo(val, end) {
    if (val < end) {
      val++
      elem.innerText = val
      setTimeout(() => crescendo(val, end), tick);
    } else {
      elem.innerText = val;
    }
  }

  if (elem.innerText == '') crescendo(0, val)
}

export function onRenderScrollAnimation(time) {
  if (!showAziende) return

  points.forEach(point => {
    let screenPos = toScreenPosition(document.querySelector(canvasSelector), point, camera)
    let screenCenter = window.innerHeight / 2
    let spread = window.innerHeight / 6

    let isCloseToCenter = screenPos.y > screenCenter - spread && screenPos.y < screenCenter + spread
    if (isCloseToCenter && !point.isCloseToCenter) {
      point.isCloseToCenter = true
      point.tween.play()
    } else if (!isCloseToCenter && point.isCloseToCenter) {
      point.isCloseToCenter = false
      point.tween.reverse()
    }
  })
}


export default function initScrollAnimation() {
  gsap.timeline({
    scrollTrigger: {
      trigger: '#map-3d',
      pin: true,
      // element viewport
      start: 'top top',
      end: window.innerWidth > 470 ? "top+=1520%" : "top+=1020%",
      scrub: 0.5,
      onEnterBack: window.innerWidth > 470 ? aziendeOn : null
    }
  })
    .add("first-scene") // 1
    .fromTo('#fade-in', { autoAlpha: 0 }, { autoAlpha: 1, ...getBasicConfig() }, "first-scene")
    .to(aura.material.uniforms.opacityFactor, { value: 0.5, ...getBasicConfig() }, "first-scene")
    .to(ambientLight, { intensity: 1, ...getBasicConfig(0.6) }, "first-scene")
    .to(camera.position, { ...proseguiCamPos(0, 1, -0.2), ...getBasicConfig(1, 'Out') }, "first-scene")
    .to(camera.rotation, { ...camRotObj(1), ...getBasicConfig(1, 'Out') }, "first-scene")

    .add('enter-text-1') // 2.6
    .to('#scroll-title-1', { x: '5%', autoAlpha: 1, ...getBasicConfig(0.5) }, '>')
    .add('entered-text-1')
    .to('#scroll-title-1', { x: '0%', ...getBasicConfig(1) }, 'entered-text-1')
    .to('#scroll-title-2', { x: '6%', autoAlpha: 1, ...getBasicConfig(0.5) }, 'entered-text-1+=0.1')
    .to('#scroll-title-2', { x: '1%', ...getBasicConfig(1) }, 'entered-text-1+=0.6')
    .to('#scroll-title-1', { x: '-50%', autoAlpha: 0, ...getBasicConfig(0.5) }, 'entered-text-1+=1')
    .to('#scroll-title-2', { x: '-50%', autoAlpha: 0, ...getBasicConfig(0.5) }, 'entered-text-1+=1.6')
    .to(camera.position, { ...camPosObj(1), ...getBasicConfig(2.6) }, 'enter-text-1')

    .add("second-scene") // 1
    .to(camera.position, { ...proseguiCamPos(1, 2, -0.1), ...getBasicConfig(1) }, "second-scene")
    .to(camera.rotation, { ...camRotObj(2), ...getBasicConfig(1) }, "second-scene")

    .add('enter-text-2') // 2
    .to('#scroll-title-3', { x: '5%', autoAlpha: 1, ...getBasicConfig(0.5) }, '>')
    .to('#scroll-title-3', { x: '0%', ...getBasicConfig(1) }, '>')
    .to('#scroll-title-3', { x: '-50%', autoAlpha: 0, ...getBasicConfig(0.5) }, '>')
    .to(camera.position, { ...camPosObj(2), ...getBasicConfig(2, 'Out') }, 'enter-text-2')

    .add("third-scene") // 1
    .to(camera.position, { ...proseguiCamPos(2, 3, -0.05), ...getBasicConfig() }, "third-scene")
    .to(camera.rotation, { ...camRotObj(3), ...getBasicConfig() }, "third-scene")

    .add('enter-text-3') // 2.6
    .to('#scroll-title-4', { x: '5%', autoAlpha: 1, ...getBasicConfig(0.5) }, '>')
    .add(
      function () {
        Array.from(document.getElementsByClassName('map-title--num')).forEach(elem => {
          elem.style.opacity = 1
          counterAnimation(elem, elem.dataset.number, 1000)
        })
      }, '>'
    )
    .add('entered-text-3')
    .to('#scroll-title-4', { x: '0%', ...getBasicConfig(1) }, 'entered-text-3')
    .to('#scroll-title-5', { x: '6%', autoAlpha: 1, ...getBasicConfig(0.5) }, 'entered-text-3+=0.1')
    .to('#scroll-title-5', { x: '1%', ...getBasicConfig(1) }, 'entered-text-3+=0.6')
    .to('#scroll-title-4', { x: '-50%', autoAlpha: 0, ...getBasicConfig(0.5) }, 'entered-text-3+=1')
    .to('#scroll-title-5', { x: '-50%', autoAlpha: 0, ...getBasicConfig(0.5) }, 'entered-text-3+=1.6')
    .to(camera.position, { ...camPosObj(3), ...getBasicConfig(2, 'Out') }, 'enter-text-3')

    .add('nord-scene') // 1
    .to(camera.position, { ...camPosObj(4), ...getBasicConfig(1, 'Out') }, 'nord-scene')
    .to(camera.rotation, { ...camRotObj(4), ...getBasicConfig(1, 'Out'), onComplete: aziendeOn, onReverseComplete: aziendeOff }, 'nord-scene')

    .add('centro-scene') // 2
    .to(camera.position, { ...camPosObj(5), ...getBasicConfig(2) }, 'centro-scene')
    .to(camera.rotation, { ...camRotObj(5), ...getBasicConfig(2) }, 'centro-scene')

    .add('sud-scene') // 2
    .to(camera.position, { ...camPosObj(6), ...getBasicConfig(2) }, 'sud-scene')
    .to(camera.rotation, { ...camRotObj(6), ...getBasicConfig(2) }, 'sud-scene')

    .add('polpogba') // 2
    .to(camera.position, { ...camPosObj(6), ...getBasicConfig(1), onComplete: aziendeOff }, 'polpogba')
}
