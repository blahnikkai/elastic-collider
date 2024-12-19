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

export function random_number(low: number, high: number): number {
    return (high - low) * Math.random() + low
}

function generate_random_body(bodies: Body[], rects: Rectangle[], m: number, v: number, r: number, x1: number = 0, x2: number = 500, y1: number = 0, y2: number = 500): Body {
    while(true) {
        const x = random_number(x1 + r, x2 - r)
        const y = random_number(y1 + r, y2 - r)
        const theta = 2 * Math.PI * Math.random()
        const vx = v * Math.cos(theta)
        const vy = v * Math.sin(theta)
        if(!check_collides_existing_bodies(bodies, x, y, r) && !check_collides_existing_rects(rects, x, y, r)) {
            return new Body(m, new Vector(x, y), new Vector(vx, vy), r)
        }
    }
}

export function spawn_bodies(n: number, m: number, v: number, r: number, spawn_rect: Rectangle, bodies: Body[]) {
    for(let i = 0; i < n; i++) {
        bodies.push(
            generate_random_body(
                bodies, [], 1, v, r, 
                spawn_rect.x1, spawn_rect.x2, spawn_rect.y1, spawn_rect.y2
            )
        )
    }
}

// number
// size
// mass
// energy
export function brownian(n: number, m: number, v: number, r: number): Body[] {
    let bodies = []
    bodies.push(generate_random_body(bodies, [], m, 0, 30))
    for(let i = 0; i < n; i++) {
        bodies.push(generate_random_body(bodies, [], 1, v, r))
    }
    bodies[0].color = 'red'
    bodies[0].is_traced = true
    bodies[1].color = 'red'
    return bodies
}

export function second_law_rects(gap_size: number): Rectangle[] {
    const w_half = 10
    const gap_half = gap_size / 2
    let rects = [
        new Rectangle(250 - w_half, 0, 250 + w_half, 250 - gap_half),
        new Rectangle(250 - w_half, 250 + gap_half, 250 + w_half, 500),
    ]
    return rects
}

export function second_law_bodies(n: number, r: number, vl: number, vr: number, rects: Rectangle[]): Body[] {
    let bodies = []
    for(let i = 0; i < n; i++) {
        bodies.push(generate_random_body(bodies, rects, 1, vl, r, 0, 240))
        bodies[bodies.length - 1].color = 'blue'
    }
    for(let i = 0; i < n; i++) {
        bodies.push(generate_random_body(bodies, rects, 1, vr, r, 260, 500))
        bodies[bodies.length - 1].color = 'red'
    }
    return bodies
}

export class Simulation {

    ctx: CanvasRenderingContext2D
    step_btn: HTMLButtonElement
    pause_btn: HTMLButtonElement
    play_btn: HTMLButtonElement
    brownian_btn: HTMLButtonElement
    second_law_btn: HTMLButtonElement
    clear_btn: HTMLButtonElement
    info_container: HTMLDivElement

    playing: boolean
    bodies: Body[]
    tick: number
    walls: Rectangle[]
    measures: Rectangle[]
    intermediate_rect: Rectangle | null

    constructor(
        ctx: CanvasRenderingContext2D,
        step_btn: HTMLButtonElement,
        pause_btn: HTMLButtonElement,
        play_btn: HTMLButtonElement,
        brownian_btn: HTMLButtonElement,
        second_law_btn: HTMLButtonElement,
        clear_btn: HTMLButtonElement,
        info_container: HTMLDivElement,
        bodies: Body[],
        walls: Rectangle[],
        measures: Rectangle[],
    ) {
        this.ctx = ctx
        this.step_btn = step_btn
        this.pause_btn = pause_btn
        this.play_btn = play_btn
        this.brownian_btn = brownian_btn
        this.second_law_btn = second_law_btn
        this.clear_btn = clear_btn
        this.info_container = info_container
        this.reset(bodies, walls, measures)
    }

    reset(bodies: Body[], walls: Rectangle[], measures: Rectangle[]) {
        this.pause()
        this.bodies = bodies
        this.tick = 0
        this.walls = walls
        this.measures = measures
        this.intermediate_rect = null
    }

    pause() {
        this.playing = false
        this.pause_btn.disabled = true
        this.play_btn.disabled = false
        this.step_btn.disabled = false
    }

    play() {
        this.playing = true
        this.play_btn.disabled = true
        this.pause_btn.disabled = false
        this.step_btn.disabled = true
        this.step_all()
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
            for(const rect of this.walls) {
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
        
        for(const wall of this.walls) {
            wall.draw(this.ctx)
        }
        
        let info_html = ''
        info_html += `<div>`
        info_html += 'Total Kinetic Energy'
        info_html += '</div>'
        info_html += `<div>`
        info_html += 'Body Count'
        info_html += '</div>'
        info_html += `<div>`
        info_html += 'Mean Kinetic Energy (Temperature)'
        info_html += '</div>'
        for(const measure of this.measures) {
            const energy = this.calc_energy(measure.x1, measure.x2, measure.y1, measure.y2)
            const body_cnt = this.count_bodies(measure.x1, measure.x2, measure.y1, measure.y2)
            const hsl_color = `style="color:hsl(${measure.color[0]}, ${measure.color[1]}%, ${measure.color[2]}%"`
            info_html += `<div ${hsl_color}">`
            info_html += energy.toFixed(2)
            info_html += '</div>'
            info_html += `<div ${hsl_color}">`
            info_html += body_cnt
            info_html += '</div>'
            info_html += `<div ${hsl_color}">`
            info_html += (energy / body_cnt).toFixed(2)
            info_html += '</div>'
            
            measure.draw(this.ctx)
        }
        this.info_container.innerHTML = info_html
        
        if(this.intermediate_rect != null) {
            this.intermediate_rect.draw(this.ctx)
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
