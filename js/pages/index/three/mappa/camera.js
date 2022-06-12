import { PerspectiveCamera } from 'three'

import { getCamPos, getCamRot } from './camUtils.js'

const near = 0.1
const far = 5000
const fov = 30
const aspect = 2

const camera = new PerspectiveCamera(fov, aspect, near, far)
camera.position.set(...getCamPos(0))
camera.rotation.set(...getCamRot(0))

export default camera