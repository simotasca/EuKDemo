import { Vector3 } from "three"

export function toScreenPosition(canvas, obj, camera) {
  var vector = new Vector3()

  var widthHalf = 0.5 * canvas.width
  var heightHalf = 0.5 * canvas.height

  obj.updateMatrixWorld()
  vector.setFromMatrixPosition(obj.matrixWorld)
  vector.project(camera)

  vector.x = (vector.x * widthHalf) + widthHalf
  vector.y = - (vector.y * heightHalf) + heightHalf

  return {
    x: vector.x,
    y: vector.y
  }
}