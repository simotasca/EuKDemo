// da utilizzare in requstanimationframe
// chiamare calculate all'inizio di ogni render
// bisogna attendere almeno delta ms per avere il primo risultato
// il risultato cambia ogni delta ms

class FPS {

  constructor(delta) {
    this.lastTime = null
    this.frames = null
    this.fps = null
    this.delta = delta || 1000
  }

  calculate(time) {
    this.frames++
    if (!this.lastTime) {
      this.lastTime = time
    } else if (time > this.lastTime + this.delta) {
      this.fps = (this.frames * this.delta * (1000 / this.delta)) / (time - this.lastTime)
      this.lastTime = time
      this.frames = 0
    }
  }

  get current() {
    return this.fps
  }

}

export default FPS