import * as THREE from 'three'
import { OBJLoader } from 'OBJLoader'
import { GLTFLoader } from 'GLTFLoader'
import { RGBELoader } from 'RGBELoader';

const bottle = new THREE.Object3D()
const glass = new THREE.Object3D()
const group = new THREE.Object3D()

let bottigliaChild = null
let bicchiereChild = null

let hdrEquirect = null
function getHdrEqui() {
  if (!hdrEquirect)
    hdrEquirect = new RGBELoader(loadingManager)
      .setPath('./resources/img/texture/bartenura/')
      .load('bismarckturm_hillside_1k.hdr', () => hdrEquirect.mapping = THREE.EquirectangularReflectionMapping)
  return hdrEquirect
}


let bottigliaMaterialLow = null
function getBottigliaMaterialLow() {
  if (!bottigliaMaterialLow)
    bottigliaMaterialLow = new THREE.MeshPhysicalMaterial({
      color: 0x03030c,
      metalness: 0,
      roughness: 0,
      // ior: 1.5,
      // transmission: 0.5,
      envMap: getHdrEqui(),
      envMapIntensity: 1,
      specularColor: 0xc0c0c0,
      specularIntensity: 0.3,
      // clearcoat: 0.25,
      // opacity: 1,
      // side: THREE.DoubleSide,
      // transparent: true,
      // depthWrite: false,
      // depthTest: true,
      flatShading: false
    })


  return bottigliaMaterialLow
}

let bottigliaMaterialGood = null
function getBottigliaMaterialGood() {
  if (!bottigliaMaterialGood)
    bottigliaMaterialGood = new THREE.MeshPhysicalMaterial({
      color: 0x000110,
      metalness: 0,
      roughness: 0,
      ior: 1.5,
      envMap: getHdrEqui(),
      envMapIntensity: 1,
      transmission: 0.5,
      specularColor: 0x000417,
      specularIntensity: 0.2,
      clearcoat: 0.25,
      opacity: 1,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      flatShading: false
    })

  return bottigliaMaterialGood
}

let glassMaterialLow = null
function getGlassMaterialLow() {
  if (!glassMaterialLow)
    glassMaterialLow = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0,
      opacity: 0,  // default
      metalness: 0.6,
      roughness: 0.1,
      ior: 1.5, // default
      envMap: getHdrEqui(),
      envMapIntensity: 1,
      specularIntensity: 1,
      // specularColor: 0xffffff,  // default
      // transparent: true,  // default
      flatShading: false, // default
      depthWrite: false,
      depthTest: true,
      side: THREE.FrontSide
    })
  return glassMaterialLow
}

let glassMaterialGood = null
function getGlassMaterialGood() {
  if (!glassMaterialGood) {
    let equi = new RGBELoader()
      .setPath('./resources/img/texture/bartenura/')
      .load('brown_photostudio_01_1k.hdr', () => equi.mapping = THREE.EquirectangularReflectionMapping)

    glassMaterialGood = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.98,
      opacity: 1,
      metalness: 0,
      roughness: 0,
      ior: 0.6,
      envMap: equi,
      envMapIntensity: 0.1,
      specularIntensity: 1,
      specularColor: 0xffffff,
      // transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.FrontSide,
    });
  }
  return glassMaterialGood
}

//// POSITIONING //////////////////////////////////////////////////////////////////

bottle.position.y -= 1.4
glass.scale.set(0.12, .12, .12)
glass.position.set(-0.85, 2.7, -1)
glass.rotateZ(Math.PI * 1 / 20)

//// OPTIMIZATION /////////////////////////////////////////////////////////////////

const baseOptimizationLevel = 0
let optimizationLevels = [
  { name: 'no rendering' },
  {
    name: 'bottiglia low bicchiere img',
    reduce: () => {
      // // rimuovere direttamente il rendering
      // let img = document.createElement('img')
      // img.src = './bottle.png'
      // img.id = "bottle-img"
      // document.querySelector('#img-container').appendChild(img)
      bottle.visible = false
    }
  },
  {
    // BASE LEVEL
    name: 'bottiglia low bicchiere low',
    increase: () => bicchiereChild.material = getGlassMaterialGood(),
    reduce: () => {
      // let img = document.createElement('img')
      // img.src = './glass.png'
      // img.id = "glass-img"
      // document.querySelector('#img-container').appendChild(img)
      glass.visible = false
    }
  },
  {
    name: 'bottiglia low bicchiere high',
    increase: () => {
      bottigliaChild.material = getBottigliaMaterialGood()
    },
    reduce: () => bicchiereChild.material = getGlassMaterialLow()
  },
  {
    name: 'bottiglia high bicchiere high',
    reduce: () => bottigliaChild.material = getBottigliaMaterialLow()
  },
]

const loadingManager = new THREE.LoadingManager()

function init() {


  const textureLoader = new THREE.TextureLoader(loadingManager)
  textureLoader.setPath('./resources/img/texture/bartenura/')
  const textureTappo = textureLoader.load('collo.png')
  const textureLabelFronte = textureLoader.load('labelFronte.png')

  const vinoMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0001b0,
    opacity: 0.1,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  })

  const tappoMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x000110,
    roughness: 0.7,
    // specularIntensity: 0.5,
    // specularColor: 0xffffff,
    side: THREE.FrontSide,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    flatShading: false
  })

  const labelTappoMaterial = new THREE.MeshStandardMaterial({
    map: textureTappo,
    transparent: true,
    side: THREE.FrontSide,
    flatShading: false
  })

  const labelFronteOutsideMaterial = new THREE.MeshStandardMaterial({
    map: textureLabelFronte,
    opacity: 1,
    transparent: true,
    side: THREE.FrontSide,
  })

  const labelFronteInsideMaterial = new THREE.MeshStandardMaterial({
    map: textureLabelFronte,
    opacity: 0.05,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: true,
  })

  new OBJLoader(loadingManager).load(
    './resources/obj/bartenura.obj',
    model => {
      model.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          if (child.name == "Label_fronte_outside") {
            child.material = labelFronteOutsideMaterial
          }
          else if (child.name == "Label_fronte_inside") {
            child.material = labelFronteInsideMaterial
          }
          else if (child.name == "Tappo") {
            child.material = tappoMaterial
          }
          else if (child.name == "Label_tappo") {
            child.material = labelTappoMaterial
          }
          else if (child.name == "Vino") {
            child.material = vinoMaterial
          }
          else if (child.name == "Bottiglia") {
            child.material = getBottigliaMaterialLow()
            bottigliaChild = child
          }
        }
      })
      bottle.add(model)
      group.add(bottle)
    },
    // xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    // error => console.log('An error happened', error)
  )

  new GLTFLoader(loadingManager).load('./resources/obj/wine_glass.glb', gltf => {
    gltf.scene.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.material = getGlassMaterialLow()
        bicchiereChild = child
      }
    })
    glass.add(bicchiereChild)
    group.add(glass)
  })
}

//// EXPORTS //////////////////////////////////////////////////////////////////////

let renderAnimation = time => glass && (glass.position.y = 2.7 + Math.sin(time * 0.001) * 0.05)

export {
  init,
  group as model,
  bottle,
  glass,
  renderAnimation as animation,
  loadingManager,
  optimizationLevels,
  baseOptimizationLevel
}