import {add} from './vector.js'

class Body {

    constructor(mass, pos, vel) {
        this.mass = mass;
        this.pos = pos
        this.vel = vel
    }

    integrate() {
        this.pos = add(this.pos, .001 * this.vel)
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, 15, 0, 2 * Math.PI)
        ctx.stroke()
    }
}