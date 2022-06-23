import * as THREE from 'three'
import { GLTFLoader } from 'GLTFLoader'
import { DRACOLoader } from 'DRACOLoader'

const dracoUrl = 'https://www.gstatic.com/draco/v1/decoders/'

const loadingManager = new THREE.LoadingManager()

export const bottle = new THREE.Object3D()
export const glass = new THREE.Object3D()
const group = new THREE.Object3D()


let hdrEquirect = null
function getHdrEqui() {
  if (!hdrEquirect) {
    hdrEquirect = new THREE.CubeTextureLoader(loadingManager)
      .setPath('./resources/img/texture/bartenura/cubemap/')
      .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
    hdrEquirect.encoding = THREE.sRGBEncoding;
    // hdrEquirect = new RGBELoader(loadingManager)
    //   .setPath('./resources/img/texture/bartenura/')
    //   .load('bismarckturm_hillside_1k.hdr', () => hdrEquirect.mapping = THREE.EquirectangularReflectionMapping)
  }
  return hdrEquirect
}

let glassMaterialGood = null
function getGlassMaterialGood() {
  if (!glassMaterialGood) {
    glassMaterialGood = new THREE.MeshPhysicalMaterial({
      color: 0x202020,
      metalness: 1,
      roughness: 0,
      // thickness: 0.2,
      ior: 1.3,
      envMap: getHdrEqui(),
      envMapIntensity: 0.3,
      specularIntensity: 1,
      specularColor: 0xffffff,
      transparent: false,
      side: THREE.FrontSide,
    });
  }
  return glassMaterialGood
}

let tomatoSauce = null
function getTomatoSauce() {
  if (!tomatoSauce) {
    let texture = new THREE.TextureLoader(loadingManager).load("./resources/img/seamless-tomato.jpg")
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set(2, 2);

    tomatoSauce = new THREE.MeshPhysicalMaterial({
      color: 0x501000,
      map: texture,
      opacity: 1,
      roughness: 1,
      ior: 1.3, // index of refraction: da 1.0 a 2.333
      clearcoat: 1,
      envMap: getHdrEqui(),
      envMapIntensity: 0.3,
      side: THREE.FrontSide
    })
  }
  return tomatoSauce
}

function init() {
  new GLTFLoader()
    .setDRACOLoader(new DRACOLoader(loadingManager).setDecoderPath(dracoUrl))
    .load('./resources/obj/sugoDraco.gltf', gltf => {
      gltf.scene.traverse(child => {
        switch (child.name) {
          case "tappo001":
            child.material = new THREE.MeshPhysicalMaterial({
              color: 0xf0f0f0,
              roughness: 0,
              metalness: 0.2
            })
            break
          case "bottiglia":
            child.material = getTomatoSauce()
            // child.visible = false
            break
          case "sugo":
            child.material = getTomatoSauce()
            break
        }
        console.log("child", child.name)
      })
      bottle.add(gltf.scene)
      group.add(bottle)
    })


  bottle.position.y += 0.5
}

init()

let renderAnimation = time => {
  // bottle.rotation.y = time * 0.00005
}

export {
  init,
  loadingManager,
  group as model,
  renderAnimation as animation
}