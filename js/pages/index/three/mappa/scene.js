import * as THREE from 'three'
import { DRACOLoader } from 'DRACOLoader'
import { GLTFLoader } from 'GLTFLoader'

import worldMap, { worldCenter } from './latiLongi.js'
import addAziende from "./aziende.js";
import * as auraShaders from './auraShaders.js'
import { DRACO_PATH } from './utils.js';

const objModelPath = '../resources/obj/worldDraco.gltf'
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
  texture.flipY=false
  const material = new THREE.MeshPhongMaterial({ map: texture, flatShading: false })

  new GLTFLoader()
    .setDRACOLoader(new DRACOLoader().setDecoderPath(DRACO_PATH))
    .load(objModelPath, gltf => {
      gltf.scene.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.material = material
        }
      })
      scene.add(gltf.scene)
    })
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