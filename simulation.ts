import {Body} from './body.js'
import {Rectangle} from './rectangle.js'
import {Vector, dist, norm} from './vector.js'
export const TICKRATE = 50

function check_collides_existing_bodies(bodies: Body[], x: number, y: number, r: number): boolean {
    for(const body of bodies) {
        if(dist(new Vector(x, y), body.pos) < body.r + r) {
            return true
        }
    }
    return false
}

function check_collides_existing_rects(rects: Rectangle[], x: number, y: number, r: number): boolean {
    for(const rect of rects) {
        if(rect.intersect(x, y, r)) {
            return true
        }
    }
    return false
}

function generate_random_body(bodies: Body[], rects: Rectangle[], m: number, v: number, r: number, x1: number = 0, x2: number = 500, y1: number = 0, y2: number = 500): Body {
    while(true) {
        const x = (x2 - x1 - 2 * r) * Math.random() + r + x1;
        const y = (y2 - y1 - 2 * r) * Math.random() + r + y1;
        const theta = 2 * Math.PI * Math.random()
        const vx = v * Math.cos(theta)
        const vy = v * Math.sin(theta)
        if(!check_collides_existing_bodies(bodies, x, y, r) && !check_collides_existing_rects(rects, x, y, r)) {
            return new Body(m, new Vector(x, y), new Vector(vx, vy), r)
        }
    }
}

// number
// size
// mass
// energy
export function brownian(n: number, m: number, v: number, r: number, rects: Rectangle[]): Body[] {
    let bodies = []
    bodies.push(generate_random_body(bodies, rects, m, 0, 30))
    for(let i = 0; i < n; i++) {
        bodies.push(generate_random_body(bodies, rects, 1, v, r))
    }
    bodies[0].color = 'red'
    bodies[0].is_traced = true
    bodies[1].color = 'red'
    return bodies
}

export function hot_and_cold(n: number, r: number, rects: Rectangle[]): Body[] {
    let bodies = []
    for(let i = 0; i < n; i++) {
        bodies.push(generate_random_body(bodies, rects, 1, 10, r, 0, 200))
        bodies[bodies.length - 1].color = 'blue'
    }
    for(let i = 0; i < n; i++) {
        bodies.push(generate_random_body(bodies, rects, 1, 100, r, 300, 500))
        bodies[bodies.length - 1].color = 'red'
    }
    return bodies
}

export class Simulation {

    playing: boolean
    ctx: CanvasRenderingContext2D
    bodies: Body[]
    tick: number
    rectangles: Rectangle[]

    constructor(ctx: CanvasRenderingContext2D, bodies: Body[], rects: Rectangle[]) {
        this.ctx = ctx
        this.reset(bodies, rects)
    }

    reset(bodies: Body[], rects: Rectangle[]) {
        this.playing = false
        this.bodies = bodies
        this.tick = 0
        this.rectangles = rects
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
        
        this.ctx.textAlign = 'right'
        
        const left_e = this.calc_energy(0, 250)
        const right_e = this.calc_energy(250, 500)
        
        this.ctx.fillText(left_e.toFixed(2), 80, 60)
        this.ctx.fillText(right_e.toFixed(2), 80, 80)

        const left_cnt = this.count_bodies(0, 250)
        const right_cnt = this.count_bodies(250, 500)

        this.ctx.fillText(left_cnt.toString(), 110, 60)
        this.ctx.fillText(right_cnt.toString(), 110, 80)

        const left_t = left_e / left_cnt
        const right_t = right_e / right_cnt

        this.ctx.fillText(left_t.toFixed(2), 160, 60)
        this.ctx.fillText(right_t.toFixed(2), 160, 80)

        this.ctx.textAlign = 'left'
        for(const rectangle of this.rectangles) {
            rectangle.draw(this.ctx)
        }
    }
    
    count_bodies(x1: number = 0, x2: number = 500, y1: number = 0, y2: number = 500): number {
        let cnt = 0
        for(const body of this.bodies) {
            if(x1 < body.pos.x && body.pos.x < x2 && y1 < body.pos.y && body.pos.y < y2) {
                cnt += 1
            }
        }
        return cnt
    }

    calc_energy(x1: number = 0, x2: number = 500, y1: number = 0, y2: number = 500): number {
        let energy = 0
        for(const body of this.bodies) {
            if(x1 < body.pos.x && body.pos.x < x2 && y1 < body.pos.y && body.pos.y < y2) {
                energy += .5 * body.mass * Math.pow(norm(body.vel), 2)
            }
        }
        return energy
    }

}
