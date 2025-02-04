import { randRange } from './functions'

export class Vector {
  y: number
  x: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  getDistance(v: Vector) {
    return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2)
  }
}

export class Agent {
  pos: Vector
  vel: Vector
  radius: number
  x: number
  y: number
  constructor(x: number, y: number) {
    this.pos = new Vector(x, y)
    this.vel = new Vector(randRange(-1, 0), randRange(-1, 0))
    this.radius = randRange(2, 10)
    this.x = x
    this.y = y
  }

  bounce(width: number, height: number) {
    if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1
  }

  update() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)
    ctx.beginPath()
    ctx.fillStyle = '#6366F1'
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}