import { Object3D, MathUtils, MeshPhongMaterial } from 'three'
import { OBJLoader } from 'OBJLoader'
// import camera from './camera.js'

const worldCenter = [-1.07, 0, -6.85]
const rotationCorrection = [0.781, 4.305, 0.28]
const surfaceRadius = 3.63

const worldMap = new Object3D()
worldMap.position.set(...worldCenter)
worldMap.rotation.set(...rotationCorrection)

const points = []

function latLongToXYZ(lat, lon, radius) {
  let phi = MathUtils.degToRad(90 - lat)
  let theta = MathUtils.degToRad(-lon)

  let x = radius * Math.sin(phi) * Math.cos(theta)
  let y = radius * Math.cos(phi)
  let z = radius * Math.sin(phi) * Math.sin(theta)

  return [x, y, z]
}

function addLatiLongiPoint(latitude, longitude, radius, name, obj) {
  let latiLongiPoint = obj

  let pos = latLongToXYZ(latitude, longitude, radius)
  latiLongiPoint.position.set(...pos)

  latiLongiPoint.tween = gsap.fromTo(latiLongiPoint.scale, { x: 0, y: 0, z: 0 }, { x: 0.005, y: 0.005, z: 0.005, paused: true })
  latiLongiPoint.azienda = name

  worldMap.add(latiLongiPoint)
  points.push(latiLongiPoint)
}

function addLatiLongiPoints(data) {
  new OBJLoader().load(
    '../../resources/obj/pointer.obj',
    model => {
      data.forEach(azienda => {
        let pointerModel = new Object3D()
        pointerModel.copy(model)

        let color = Math.random() > 0.5 ? 'white' : 'orange'
        const material = new MeshPhongMaterial({ color: color })
        pointerModel.children[0].material = material
        pointerModel.baseColor = color

        addLatiLongiPoint(azienda.lati, azienda.longi, surfaceRadius, azienda.nome, pointerModel)
      });
    },
    xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    error => console.log('An error happened', error)
  )
}

function onRenderLatiLongiPoints() {
  // points.forEach(p => p.scale != 0 && p.lookAt(camera.position))
}

export default worldMap
export {
  worldCenter, rotationCorrection, surfaceRadius,
  points,
  addLatiLongiPoints, onRenderLatiLongiPoints
}