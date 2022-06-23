import * as THREE from 'three'
import { OBJLoader } from 'OBJLoader'
import { RGBELoader } from 'RGBELoader';

const loadingManager = new THREE.LoadingManager()



function init() {
  const hdrEquirect = new RGBELoader(loadingManager)
    .setPath('./resources/img/texture/bartenura/')
    .load('bismarckturm_hillside_1k.hdr', () => hdrEquirect.mapping = THREE.EquirectangularReflectionMapping)

  const textureLoader = new THREE.TextureLoader(loadingManager)
  textureLoader.setPath('./resources/img/texture/bartenura/')
  const textureTappo = textureLoader.load('collo.png')
  textureLoader.setPath('./resources/img/texture/levante/')
  const textureLabelFronte = textureLoader.load('labelFronte.png')

  const bottigliaMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x001000,
    metalness: 0,
    roughness: 0,
    ior: 1.5,
    envMap: hdrEquirect,
    envMapIntensity: 1,
    transmission: 0.5,
    specularColor: 0x001000,
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
    color: 0x20b020,
    opacity: 0.1,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  })

  const tappoMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x001000,
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
            // child.visible = false
          }
          else if (child.name == "Bottiglia") {
            child.material = bottigliaMaterial
          }
        }
      })
      bottle.add(model)
      group.add(bottle)
    }
  )

  bottle.position.y -= 1.4
}



let renderAnimation = time => {
}

export {
  init,
  loadingManager,
  group as model,
  bottle,
  renderAnimation as animation
}