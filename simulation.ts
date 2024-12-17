import {Body} from './body.js'
import {Vector, dist, norm} from './vector.js'
export const TICKRATE = 50

function check_collides_existing(bodies: Body[], x: number, y: number, r: number): boolean {
    for(const body of bodies) {
        if(dist(new Vector(x, y), body.pos) < body.r + r) {
            return true
        }
    }
    return false
}

export function brownian(n: number, v: number, r: number): Body[] {
    let bodies = []
    bodies.push(new Body(100, new Vector(250, 250), new Vector(0, 0), 30, 'red', true))
    for(let i = 0; i < n; i++) {
        while(true) {
            const x = (500 - 2 * r) * Math.random() + r;
            const y = (500 - 2 * r) * Math.random() + r;
            if(!check_collides_existing(bodies, x, y, r)) {
                let color = 'black'
                if(i < 1) {
                    color = 'red'
                }
                bodies.push(new Body(1, new Vector(x, y), new Vector(v, v), r, color))
                break
            }
        }
    }
    return bodies
}

export class Simulation {

    playing: boolean
    ctx: CanvasRenderingContext2D
    bodies: Body[]
    tick: number
    rectangles: number[][]

    constructor(ctx: CanvasRenderingContext2D, bodies: Body[]) {
        this.ctx = ctx
        this.playing = false
        this.bodies = bodies
        this.tick = 0
        this.rectangles = [[100, 200, 300, 400]]
    }

    step_all(): void {
        this.tick += 1
        for(let i = 0; i < this.bodies.length; i++) {
            for(let j = i + 1; j < this.bodies.length; j++) {
                this.bodies[i].check_other_collide(this.bodies[j])
            }
        }
        for(const body of this.bodies) {
            body.step()
        }
        for(const body of this.bodies) {
            body.check_wall_collide()
            for(const rect of this.rectangles) {
                body.check_rect_collide(rect)
            }
        }
        if(this.playing) {
            setTimeout(() => this.step_all(), 1000 / TICKRATE)
        }
    }

    draw_all(): void {
        this.ctx.clearRect(0, 0, 500, 500)
        for(const body of this.bodies) {
            body.draw(this.ctx)
        }
        const energy = this.calc_energy()
        this.ctx.fillStyle = 'black'
        this.ctx.strokeStyle = 'black'
        this.ctx.fillText(energy.toString(), 20, 20)
        this.ctx.fillText(this.tick.toString(), 20, 40)
        for(const rectangle of this.rectangles) {
            const x1 = rectangle[0]
            const y1 = rectangle[1]
            const x2 = rectangle[2]
            const y2 = rectangle[3]
            this.ctx.beginPath()
            this.ctx.moveTo(x1, y1)
            this.ctx.lineTo(x2, y1)
            this.ctx.lineTo(x2, y2)
            this.ctx.lineTo(x1, y2)
            this.ctx.lineTo(x1, y1)
            this.ctx.closePath()
            this.ctx.stroke()
            // this.ctx.fill()
        }
    }

    calc_energy(): number {
        let energy = 0
        for(const body of this.bodies) {
            energy += .5 * body.mass * Math.pow(norm(body.vel), 2)
        }
        return energy
    }

}
