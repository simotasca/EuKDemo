import {
  Object3D, Mesh,
  LoadingManager, TextureLoader, CubeTextureLoader,
  sRGBEncoding,
  MeshPhysicalMaterial, MeshStandardMaterial,
  FrontSide, BackSide, DoubleSide,
} from 'three'
import { GLTFLoader } from 'GLTFLoader'
// import { RGBELoader } from 'RGBELoader';
import { DRACOLoader } from 'DRACOLoader'

const dracoUrl = 'https://www.gstatic.com/draco/v1/decoders/'

const bottle = new Object3D()
const glass = new Object3D()
const group = new Object3D()

let bottigliaChild = null
let bicchiereChild = null

const loadingManager = new LoadingManager()

let hdrEquirect = null
function getHdrEqui() {
  if (!hdrEquirect) {
    hdrEquirect = new CubeTextureLoader(loadingManager)
      .setPath('./resources/img/texture/bartenura/cubemap/')
      .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
    hdrEquirect.encoding = sRGBEncoding;
    // hdrEquirect = new RGBELoader(loadingManager)
    //   .setPath('./resources/img/texture/bartenura/')
    //   .load('bismarckturm_hillside_1k.hdr', () => hdrEquirect.mapping = THREE.EquirectangularReflectionMapping)
  }
  return hdrEquirect
}

let bottigliaMaterialLow = null
function getBottigliaMaterialLow() {
  if (!bottigliaMaterialLow)
    bottigliaMaterialLow = new MeshPhysicalMaterial({
      color: 0x03030c,
      metalness: 0,
      roughness: 0,
      // ior: 1.5,
      // transmission: 0.5,
      envMap: getHdrEqui(),
      envMapIntensity: 2.5,
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

// let bottigliaMaterialGood = null
// function getBottigliaMaterialGood() {
//   if (!bottigliaMaterialGood)
//     bottigliaMaterialGood = new THREE.MeshPhysicalMaterial({
//       color: 0x000110,
//       metalness: 0,
//       roughness: 0,
//       ior: 1.5,
//       envMap: getHdrEqui(),
//       envMapIntensity: 2.5,
//       transmission: 0.5,
//       specularColor: 0x000417,
//       specularIntensity: 0.2,
//       clearcoat: 0.25,
//       opacity: 1,
//       side: THREE.DoubleSide,
//       transparent: true,
//       depthWrite: false,
//       depthTest: true,
//       flatShading: false
//     })

//   return bottigliaMaterialGood
// }

// let glassMaterialLow = null
// function getGlassMaterialLow() {
//   if (!glassMaterialLow)
//     glassMaterialLow = new THREE.MeshPhysicalMaterial({
//       color: 0xffffff,
//       transmission: 0,
//       opacity: 0,  // default
//       metalness: 0.6,
//       roughness: 0.1,
//       ior: 1.5, // default
//       envMap: getHdrEqui(),
//       envMapIntensity: 1,
//       specularIntensity: 1,
//       // specularColor: 0xffffff,  // default
//       // transparent: true,  // default
//       flatShading: false, // default
//       depthWrite: false,
//       depthTest: true,
//       side: THREE.FrontSide
//     })
//   return glassMaterialLow
// }

// let glassMaterialGood = null
// function getGlassMaterialGood() {
//   if (!glassMaterialGood) {
//     let equi = new RGBELoader()
//       .setPath('./resources/img/texture/bartenura/')
//       .load('brown_photostudio_01_1k.hdr', () => equi.mapping = THREE.EquirectangularReflectionMapping)
//     // let equi = new THREE.CubeTextureLoader(loadingManager)
//     //   .setPath('./resources/img/texture/bartenura/cubemap2/')
//     //   .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

//     glassMaterialGood = new THREE.MeshPhysicalMaterial({
//       color: 0xffffff,
//       transmission: 0.98,
//       opacity: 1,
//       metalness: 0,
//       roughness: 0,
//       ior: 0.6,
//       envMap: equi,
//       envMapIntensity: 0.2,
//       specularIntensity: 1,
//       specularColor: 0xffffff,
//       // transparent: true,
//       depthWrite: false,
//       depthTest: true,
//       side: THREE.FrontSide,
//     });
//   }
//   return glassMaterialGood
// }

//// POSITIONING //////////////////////////////////////////////////////////////////
bottle.position.y -= 1.4
glass.scale.set(0.12, .12, .12)
glass.position.set(-0.85, 2.7, -1)
glass.rotateZ(Math.PI * 1 / 20)

//// OPTIMIZATION /////////////////////////////////////////////////////////////////

const baseOptimizationLevel = 1
// let optimizationLevels = [
//   { name: 'no rendering' },
//   {
//     name: 'bottiglia low bicchiere img',
//     reduce: () => {
//       // // rimuovere direttamente il rendering
//       // let img = document.createElement('img')
//       // img.src = './bottle.png'
//       // img.id = "bottle-img"
//       // document.querySelector('#img-container').appendChild(img)
//       bottle.visible = false
//     }
//   },
//   {
//     // BASE LEVEL
//     name: 'bottiglia low bicchiere low',
//     increase: () => { /*bicchiereChild.material = getGlassMaterialGood()*/ },
//     reduce: () => {
//       // let img = document.createElement('img')
//       // img.src = './glass.png'
//       // img.id = "glass-img"
//       // document.querySelector('#img-container').appendChild(img)
//       glass.visible = false
//     }
//   },
//   {
//     name: 'bottiglia low bicchiere high',
//     increase: () => {
//       bottigliaChild.material = getBottigliaMaterialGood()
//     },
//     reduce: () => { /*bicchiereChild.material = getGlassMaterialLow()*/ }
//   },
//   {
//     name: 'bottiglia high bicchiere high',
//     reduce: () => bottigliaChild.material = getBottigliaMaterialLow()
//   },
// ]

let optimizationLevels = [
  { name: 'no rendering' },
  {
    name: 'bottiglia low',
    increase: () => {
      bottigliaChild.material.dispose()
      // --
      // bottigliaChild.material = getBottigliaMaterialGood()
      bottigliaChild.material.color.setHex(0x000110)
      bottigliaChild.material.metalness = 0
      bottigliaChild.material.roughness = 0
      bottigliaChild.material.ior = 1.5
      // // bottigliaChild.material.envMap =
      // // bottigliaChild.material.envMapIntensity = 
      bottigliaChild.material.transmission = 0.5
      bottigliaChild.material.specularColor.setHex(0x000417)
      bottigliaChild.material.specularIntensity = 0.2
      bottigliaChild.material.clearcoat = 0.25
      // bottigliaChild.material.opacity = 1
      bottigliaChild.material.side = DoubleSide
      bottigliaChild.material.transparent = true
      bottigliaChild.material.depthWrite = false
      bottigliaChild.material.depthTest = true
      bottigliaChild.material.flatShading = false
      //--
      bottigliaChild.material.needsUpdate = true
    },
    reduce: () => bottle.visible = false
  },
  {
    name: 'bottiglia high',
    reduce: () => bottigliaChild.material = getBottigliaMaterialLow()
  },
]


function init() {
  const textureLoader = new TextureLoader(loadingManager)
  textureLoader.setPath('./resources/img/texture/bartenura/')
  const textureTappo = textureLoader.load('collo.png')
  textureTappo.flipY = false
  const textureLabelFronte = textureLoader.load('labelFronte.png')
  textureLabelFronte.flipY = false

  const vinoMaterial = new MeshPhysicalMaterial({
    color: 0x0001b0,
    opacity: 0.1,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  })

  const tappoMaterial = new MeshPhysicalMaterial({
    color: 0x000110,
    roughness: 0.7,
    // specularIntensity: 0.5,
    // specularColor: 0xffffff,
    side: FrontSide,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    flatShading: false
  })

  const labelTappoMaterial = new MeshStandardMaterial({
    map: textureTappo,
    transparent: true,
    side: FrontSide,
    flatShading: false
  })

  const labelFronteOutsideMaterial = new MeshStandardMaterial({
    map: textureLabelFronte,
    opacity: 1,
    transparent: true,
    side: FrontSide,
  })

  const labelFronteInsideMaterial = new MeshStandardMaterial({
    map: textureLabelFronte,
    opacity: 0.05,
    transparent: true,
    side: BackSide,
    depthWrite: false,
    depthTest: true,
  })

  new GLTFLoader()
    .setDRACOLoader(new DRACOLoader(loadingManager).setDecoderPath(dracoUrl))
    .load('./resources/obj/bartenuraDraco.gltf', gltf => {
      gltf.scene.traverse(child => {
        if (child instanceof Mesh) {
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
            bottigliaChild = child
            bottigliaChild.material = getBottigliaMaterialLow()
          }
        }
      })
      bottle.add(gltf.scene)
      group.add(bottle)
    })


  // new GLTFLoader(loadingManager).setDRACOLoader(new DRACOLoader(loadingManager).setDecoderPath(dracoUrl)).load('./resources/obj/wine_glassDraco.glb', gltf => {
  //   gltf.scene.traverse(child => {
  //     if (child instanceof THREE.Mesh) {
  //       child.material = getGlassMaterialLow()
  //       bicchiereChild = child
  //     }
  //   })
  //   glass.add(bicchiereChild)
  //   group.add(glass)
  // })
}

//// EXPORTS //////////////////////////////////////////////////////////////////////

function renderAnimation(time) {
  // glass && (glass.position.y = 2.7 + Math.sin(time * 0.001) * 0.05)
}

const imageSrc = './resources/img/index/bartenura.png'

export {
  init,
  group as model,
  bottle,
  glass,
  imageSrc,
  renderAnimation as animation,
  loadingManager,
  optimizationLevels,
  baseOptimizationLevel
}

