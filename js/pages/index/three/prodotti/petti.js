import {
  Object3D,
  LoadingManager, TextureLoader, CubeTextureLoader,
  sRGBEncoding,
  MeshPhysicalMaterial,
  FrontSide
} from 'three'
import { GLTFLoader } from 'GLTFLoader'
import { DRACOLoader } from 'DRACOLoader'

const dracoUrl = 'https://www.gstatic.com/draco/v1/decoders/'

const loadingManager = new LoadingManager()

export const bottle = new Object3D()
export const glass = new Object3D()
const group = new Object3D()


let hdrEquirect = null
function getHdrEqui() {
  if (!hdrEquirect) {
    hdrEquirect = new CubeTextureLoader(loadingManager)
      .setPath('./resources/img/texture/bartenura/cubemap/')
      .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
    hdrEquirect.encoding = sRGBEncoding;
    // hdrEquirect = new RGBELoader(loadingManager)
    //   .setPath('./resources/img/texture/bartenura/')
    //   .load('bismarckturm_hillside_1k.hdr', () => hdrEquirect.mapping = EquirectangularReflectionMapping)
  }
  return hdrEquirect
}

let glassMaterialGood = null
function getGlassMaterialGood() {
  if (!glassMaterialGood) {
    glassMaterialGood = new MeshPhysicalMaterial({
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
      side: FrontSide,
    });
  }
  return glassMaterialGood
}

let tomatoSauce = null
function getTomatoSauce() {
  if (!tomatoSauce) {
    let texture = new TextureLoader(loadingManager).load("./resources/img/texture/petti/seamless-tomato.jpg")
    // texture.wrapS = RepeatWrapping;
    // texture.wrapT = RepeatWrapping;
    // texture.repeat.set(2, 2);

    tomatoSauce = new MeshPhysicalMaterial({
      color: 0x501000,
      map: texture,
      opacity: 1,
      roughness: 1,
      ior: 1.3, // index of refraction: da 1.0 a 2.333
      clearcoat: 1,
      envMap: getHdrEqui(),
      envMapIntensity: 0.3,
      side: FrontSide
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
            child.material = new MeshPhysicalMaterial({
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
        // console.log("child", child.name)
      })
      bottle.add(gltf.scene)
      group.add(bottle)
    })


  bottle.position.y += 1
  group.visible = false
}

let renderAnimation = time => {
  // bottle.rotation.y = time * 0.00005
}

const imageSrc = './resources/img/index/belfiore.png'

export {
  init,
  loadingManager,
  group as model,
  imageSrc,
  renderAnimation as animation
}