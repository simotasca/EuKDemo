import { Vector3, MathUtils } from 'three'

let tablet = window.innerWidth < 1200
// window.addEventListener('resize', () => tablet = window.innerWidth < 1200)

const visuali = [
  {
    // mondo zoom-in
    camPosition: [-1.25, 0.13, -2.99],
    camRotation: [62.26, -2.27, 4.3]
  },
  {
    // mondo zoom-out
    camPosition: tablet ? [-1.45, -1.97, -2.04] : [-1.13, -1.86, -2.06],
    camRotation: tablet ? [66.14, -2.65, 5.98] : [64.23, -2.29, 4.73]
  },
  {
    // europa lato
    camPosition: tablet ? [-2.98, -0.01, -1.34] : [-2.53, 0.13, -1.74],
    camRotation: tablet ? [24.66, -41.18, 16.82] : [25.8, -40.71, 17.5]
  },
  {
    // italia
    camPosition: tablet ? [-1.42, 0.7, -1.49] : [-1.26, 0.34, -1.9],
    camRotation: tablet ? [3.41, -7.63, 0.45] : [20.2, -7.12, 1.61]
  },
  {
    // nord
    camPosition: [-1.39, 0.55, -2.3],
    camRotation: [22.43, -7.69, 3.16]
  },
  {
    // centro
    camPosition: [-1.33, 0.33, -2.26],
    camRotation: [22.43, -7.69, 3.16]
  },
  {
    // sud
    camPosition: [-1.24, 0.21, -2.29],
    camRotation: [22.43, -7.69, 3.16]
  }
]

export const getCamPos = i => visuali[i].camPosition
export const getCamRot = i => visuali[i].camRotation.map(v => MathUtils.degToRad(v))
export const camArrayToObj = arr => ({ x: arr[0], y: arr[1], z: arr[2] })
export const camPosObj = i => camArrayToObj(getCamPos(i))
export const camRotObj = i => camArrayToObj(getCamRot(i))

function proseguiDirezione(vec1, vec2, delta) {
  let normalDelta = new Vector3().copy(vec1).sub(vec2).normalize().multiplyScalar(delta)
  let result = new Vector3().copy(vec2).sub(normalDelta)
  return [result.x, result.y, result.z]
}

function proseguiDirezioneArray(arr1, arr2, delta) {
  let vec0 = new Vector3(...arr1)
  let vec1 = new Vector3(...arr2)
  return proseguiDirezione(vec0, vec1, delta)
}

export function proseguiCamPos(idx1, idx2, delta) {
  return camArrayToObj(proseguiDirezioneArray(getCamPos(idx1), getCamPos(idx2), delta))
}

export function proseguiCamRot(idx1, idx2, delta) {
  return camArrayToObj(proseguiDirezioneArray(getCamRot(idx1), getCamRot(idx2), delta))
}