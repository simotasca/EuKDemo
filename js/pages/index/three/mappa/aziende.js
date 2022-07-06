import { Color } from "three"
import camera from "./camera.js"
import { addLatiLongiPoints } from "./latiLongi.js"
import scene from "./scene.js"

// export let pickHelper = null
let lastAzienda = null

const pickedColor = new Color('red')

export function onRenderAziende(time) {
  // pickHelper && pickHelper.pick(scene, camera, time)
}

function turnOffLastAzienda() {
  lastAzienda.material.color = new Color(lastAzienda.parent.baseColor)
  if (lastAzienda?.parent.label) {
    lastAzienda.parent.label.classList.remove('label-azienda--visible')
  }
}

function getDistance(a, b) {
  return Math.sqrt(Math.pow(a.lati - b.lati, 2) + Math.pow(a.longi - b.longi, 2))
}

function calculateShifts(p, newP, minDist) {
  let inclinazione = (newP.lati - p.lati) / (newP.longi - p.longi)
  inclinazione = inclinazione || 0
  let angolo = Math.atan(inclinazione)
  let ipotenusa = minDist / 2
  let catetoLati = Math.cos(angolo) * ipotenusa
  let catetoLongi = Math.sin(angolo) * ipotenusa
  return {
    lati: catetoLati / 2,
    longi: catetoLongi / 2
  }
}

function spacePoints(points, newPoint) {
  const minDistance = 0.2
  let problems = false
  points.forEach(p => {
    if (getDistance(p, newPoint) < minDistance) {
      let shift = calculateShifts(p, newPoint, minDistance)
      newPoint.lati += shift.lati
      newPoint.longi += shift.longi
      problems = true
    }
  })
  return { problems: problems, newPoint: newPoint };
}

function prepareData(data) {
  let result = []
  data.aziende.forEach((azienda) => {
    let lati = azienda.coords[0]
    let longi = azienda.coords[1]
    let nome = azienda.azienda
    let newPoint = { lati: lati, longi: longi, nome: nome }
    while (true) {
      const spRes = spacePoints(result, newPoint)
      if (!spRes.problems) {
        result.push(spRes.newPoint)
        break
      } else {
        newPoint = spRes.newPoint
      }
    }
  })
  console.log(data.aziende, result)
  return result
}

export default function addAziende() {

  fetch('../aziende.json').then(r => r.json()).then(data => prepareData(data)).then(aziende => {
    // console.log("numero aziende: ", aziende.length)
    addLatiLongiPoints(aziende)

    // if (window.innerWidth > 470) {
    //   pickHelper = new PickHelper(canvas, picked => {

    //     if (picked.name == "Pointer") {
    //       console.log(picked)
    //     }

    //     let azienda = picked?.parent.azienda
    //     // console.log(azienda)

    //     if (lastAzienda && lastAzienda != picked) {
    //       turnOffLastAzienda()
    //     }

    //     if (azienda) {
    //       let parent = picked.parent
    //       if (!parent.label) {
    //         let label = document.createElement('div')
    //         label.className = "label-azienda"
    //         label.innerHTML = `
    //         <p class="nome-azienda h3">${azienda}</p>
    //         <p><u>Lista prodotti</u></p>
    //       `
    //         document.querySelector("#aziende-container").appendChild(label)
    //         parent.label = label

    //         setTimeout(() => parent.label.classList.add('label-azienda--visible'), 10)
    //       } else {
    //         parent.label.classList.add('label-azienda--visible')
    //       }

    //       let position = toScreenPosition(picked, camera)
    //       parent.label.style.left = position.x + 'px'
    //       parent.label.style.top = position.y + 'px'

    //       picked.material.color = pickedColor

    //       lastAzienda = picked
    //     }
    //   })
    // }

  })

}
