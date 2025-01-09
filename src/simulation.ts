import { Body } from './body.js'
import { Rectangle, RectangleType } from './rectangle.js'
import { Vector, dist, norm } from './vector.js'
import Plotly from 'plotly.js-dist'

export const TICKRATE = 50

function check_collides_existing_bodies(bodies: Body[], x: number, y: number, r: number): boolean {
    for (const body of bodies) {
        if (dist(new Vector(x, y), body.pos) < body.r + r) {
            return true
        }
    }
    return false
}

function check_collides_existing_rects(rects: Rectangle[], x: number, y: number, r: number): boolean {
    for (const rect of rects) {
        if (rect.intersect(x, y, r)) {
            return true
        }
    }
    return false
}

function random_spawn(low: number, high: number, r: number): number {
    if (high - low > 2 * r) {
        return random_number(low + r, high - r)
    }
    return random_number(low, high)
}

export function random_number(low: number, high: number): number {
    return (high - low) * Math.random() + low
}

function generate_random_body(bodies: Body[], rects: Rectangle[], m: number, v: number, r: number, hue: number | null = null, x1: number = 0, x2: number = 500, y1: number = 0, y2: number = 500): Body {
    let i = 0
    while (true) {
        if (i >= 100_000) {
            return null
        }
        const x = random_spawn(x1, x2, r)
        const y = random_spawn(y1, y2, r)
        const theta = 2 * Math.PI * Math.random()
        const vx = v * Math.cos(theta)
        const vy = v * Math.sin(theta)
        if (!check_collides_existing_bodies(bodies, x, y, r) && !check_collides_existing_rects(rects, x, y, r)) {
            return new Body(m, new Vector(x, y), new Vector(vx, vy), r, hue)
        }
        i++
    }
}

export function spawn_bodies(n: number, m: number, v: number, r: number, spawn_rect: Rectangle, bodies: Body[], walls: Rectangle[], hue: number): Body[] {
    let new_bodies = [...bodies]
    for (let i = 0; i < n; i++) {
        const body = generate_random_body(
            new_bodies, walls, m, v, r, hue,
            spawn_rect.x1, spawn_rect.x2, spawn_rect.y1, spawn_rect.y2
        )
        if (body == null) {
            return bodies
        }
        new_bodies.push(body)
    }
    return new_bodies
}

// number
// size
// mass
// energy
export function brownian(n: number, m: number, v: number, r: number): Body[] {
    let bodies = []
    bodies.push(generate_random_body(bodies, [], m, 0, 30))
    for (let i = 0; i < n; i++) {
        bodies.push(generate_random_body(bodies, [], 1, v, r))
    }
    bodies[0].color = 'red'
    bodies[0].draw_trace = true
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

export function second_law_measures(): Rectangle[] {
    const left_measure = new Rectangle(0, 0, 250, 500, RectangleType.Measurement, 240)
    const right_measure = new Rectangle(250, 0, 500, 500, RectangleType.Measurement, 0)
    return [left_measure, right_measure]
}

export function second_law_bodies(n: number, r: number, vl: number, vr: number, rects: Rectangle[]): Body[] {
    let bodies = []
    for (let i = 0; i < n; i++) {
        bodies.push(generate_random_body(bodies, rects, 1, vl, r, 240, 0, 240))
    }
    for (let i = 0; i < n; i++) {
        bodies.push(generate_random_body(bodies, rects, 1, vr, r, 0, 260, 500))
    }
    return bodies
}

export class Simulation {

    timeout_id: number
    tick: number
    bodies: Body[]
    walls: Rectangle[]
    measures: Rectangle[]
    intermediate_rect: Rectangle | null

    constructor() {
        this.bodies = []
        this.walls = []
        this.measures = []
        this.tick = 0
        this.intermediate_rect = null
    }

    reset(bodies: Body[], walls: Rectangle[], measures: Rectangle[]) {
        this.pause()
        this.bodies = bodies
        this.tick = 0
        this.walls = walls
        this.measures = measures
        this.intermediate_rect = null
    }

    play() {
        this.step_all()
    }

    pause() {
        clearTimeout(this.timeout_id)
        this.timeout_id = null
    }

    step_all(step_again: boolean = true): void {
        this.tick += 1
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                this.bodies[i].check_other_collide(this.bodies[j])
            }
        }
        for (const body of this.bodies) {
            body.step()
        }
        for (const body of this.bodies) {
            body.check_wall_collide()
            for (const rect of this.walls) {
                body.check_rect_collide(rect)
            }
        }
        if (step_again) {
            this.timeout_id = setTimeout(() => this.step_all(), 1000 / TICKRATE)
        }
    }

    draw_all(ctx: CanvasRenderingContext2D, measure_grid: HTMLDivElement, plot: HTMLDivElement): void {
        ctx.clearRect(0, 0, 500, 500)
        for (const body of this.bodies) {
            body.draw(ctx)
        }

        ctx.fillStyle = 'black'
        ctx.strokeStyle = 'black'
        ctx.fillText(this.calc_total_energy().toFixed(2), 5, 15)
        ctx.fillText(this.tick.toString(), 5, 30)

        for (const wall of this.walls) {
            wall.draw(ctx)
        }

        if (this.intermediate_rect != null && this.intermediate_rect.type == RectangleType.Wall) {
            this.intermediate_rect.draw(ctx)
        }

        let measure_html = ''
        measure_html += `<div>`
        measure_html += 'Total Kinetic Energy'
        measure_html += '</div>'
        measure_html += `<div>`
        measure_html += 'Body Count'
        measure_html += '</div>'
        measure_html += `<div>`
        measure_html += 'Mean Kinetic Energy (Temperature)'
        measure_html += '</div>'
        for (const measure of this.measures) {
            const [energy, body_cnt] = measure.calc_energy(this.bodies, this.tick)
            const hsl_color = `style="color:hsl(${measure.color[0]}, ${measure.color[1]}%, ${measure.color[2]}%"`
            measure_html += `<div ${hsl_color}">`
            measure_html += energy.toFixed(2)
            measure_html += '</div>'
            measure_html += `<div ${hsl_color}">`
            measure_html += body_cnt
            measure_html += '</div>'
            measure_html += `<div ${hsl_color}">`
            measure_html += (energy / body_cnt).toFixed(2)
            measure_html += '</div>'

            measure.draw(ctx)
        }
        measure_grid.innerHTML = measure_html

        if (this.intermediate_rect != null && this.intermediate_rect.type !== RectangleType.Wall) {
            this.intermediate_rect.draw(ctx)
        }

        if (this.tick % 100 == 0) {
            Plotly.redraw(plot)
        }
    }

    calc_total_energy(): number {
        let energy = 0
        for (const body of this.bodies) {
            energy += .5 * body.mass * Math.pow(norm(body.vel), 2)
        }
        return energy
    }

    delete_bodies(delete_rect: Rectangle): void {
        let new_bodies = []
        for (const body of this.bodies) {
            if (!check_collides_existing_rects([delete_rect], body.pos.x, body.pos.y, 0)) {
                new_bodies.push(body)
            }
        }
        this.bodies = new_bodies
    }

}
