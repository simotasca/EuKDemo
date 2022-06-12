import * as THREE from 'three'
import { OBJLoader } from 'OBJLoader'

import worldMap, { worldCenter } from './latiLongi.js'
import addAziende from "./aziende.js";
import * as auraShaders from './auraShaders.js'

const objModelPath = '../resources/obj/model.obj'
const objTexturePath = '../resources/obj/model.jpeg'

const auraRadius = 3.9

let scene = null
let ambientLight = null
let aura = null

function addLights() {
  ambientLight = new THREE.AmbientLight('white', 0.3)
  scene.add(ambientLight)
}

function addEarthModel() {
  const texture = new THREE.TextureLoader().load(objTexturePath)
  const material = new THREE.MeshPhongMaterial({ map: texture, flatShading: false })

  new OBJLoader().load(
    objModelPath,
    model => {
      model.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material = material
          child.receiveShadow = true
        }
      })
      scene.add(model)
    },
    // xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    // error => console.log('An error happened', error)
  )
}

function addWorldMap() {
  scene.add(worldMap)
}

function addAura() {
  aura = new THREE.Mesh(
    new THREE.SphereBufferGeometry(auraRadius, 40, 20),
    new THREE.ShaderMaterial({
      vertexShader: auraShaders.vertex,
      fragmentShader: auraShaders.fragment,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      uniforms: {
        opacityFactor: { value: 0 }
      }
    }))

  aura.position.set(...worldCenter)
  // per aggiungere direttamente al world va corretto lo shader
  scene.add(aura)
}

scene = new THREE.Scene()
addLights()
addEarthModel()
addWorldMap()
addAura()

addAziende()


export default scene
export { ambientLight, aura }