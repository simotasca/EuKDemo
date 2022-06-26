import * as THREE from 'three'
import { OBJLoader } from 'OBJLoader'
import { GLTFLoader } from 'GLTFLoader'
import { RGBELoader } from 'RGBELoader';
import Stats from 'Stats'


//// SCENE //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const scene = new THREE.Scene()

const near = 0.1
const far = 2500
const fov = 30
const aspect = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 0, 14)
camera.lookAt(0, 0, 0)

const light = new THREE.PointLight('white', 0.7, 100)
light.position.set(7, 5, 5)
scene.add(light)

scene.add(new THREE.AmbientLight('white', 0.2))

const hdrEquirect = new RGBELoader()
  .setPath('./')
  .load('bismarckturm_hillside_1k.hdr', () => hdrEquirect.mapping = THREE.EquirectangularReflectionMapping)

const textureLoader = new THREE.TextureLoader()
textureLoader.setPath('./')
const textureTappo = textureLoader.load('collo.png')
const textureLabelFronte = textureLoader.load('labelFronte.png')

let bottigliaMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x000110,
  metalness: 0,
  roughness: 0,
  ior: 1.5,
  envMap: hdrEquirect,
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

bottigliaMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x000110,
  metalness: 0,
  roughness: 0,
  ior: 1.5,
  envMap: hdrEquirect,
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

const vinoMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x0001b0,
  opacity: 0.1,
  transparent: true,
  depthWrite: false,
  depthTest: true,
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

const bottle = new THREE.Object3D()
const glass = new THREE.Object3D()
const group = new THREE.Object3D()

new OBJLoader().load(
  './bartenura.obj',
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
          child.material = bottigliaMaterial
        }
      }
    })
    bottle.add(model)
    group.add(bottle)
  },
  xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
  error => console.log('An error happened', error)
)

new GLTFLoader().load('./wine_glass.glb', gltf => {
  gltf.scene.traverse(child => {
    if (child instanceof THREE.Mesh) {
      let equi = new RGBELoader()
        .load('brown_photostudio_01_1k.hdr', () => equi.mapping = THREE.EquirectangularReflectionMapping)
      child.material = new THREE.MeshPhysicalMaterial({
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
  })
  glass.add(gltf.scene)
  group.add(glass)
})

bottle.position.y -= 1.4
glass.scale.set(0.12, .12, .12)
glass.position.set(-0.85, 2.7, -1)
glass.rotateZ(Math.PI * 1 / 20)

// bottle.matrixAutoUpdate = false
// bottle.updateMatrix()

scene.add(group)

let renderAnimation = time => bottle && (bottle.position.y = Math.sin(time * 0.001) * 0.05)



//// RENDERING //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#main-canvas'),
  alpha: true,
  antialias: true
})

renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setPixelRatio(1)

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement
  // const pixelRatio = USE_DEVIXE_PX_RATIO ? window.devicePixelRatio : null
  const width = canvas.clientWidth // * (pixelRatio | 1)
  const height = canvas.clientHeight // * (pixelRatio | 1)
  const needResize = canvas.width !== width || canvas.height !== height

  if (needResize) renderer.setSize(width, height, false)

  return needResize
}

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function render(time) {

  stats.begin()

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }

  renderAnimation(time)

  renderer.render(scene, camera)
  requestAnimationFrame(render)

  stats.end()
}
requestAnimationFrame(render)