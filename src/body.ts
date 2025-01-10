import { dist, add, scale, sub, dot, norm, Vector } from './vector.js'
import { Rectangle } from './rectangle.js'
import { TICKRATE, CANVAS_SIZE } from './simulation.js'

export class Body {

    mass: number
    pos: Vector
    vel: Vector
    r: number
    color: string
    draw_trace: boolean
    trace: Vector[]

    constructor(mass: number, pos: Vector, vel: Vector, r: number, hue: number | null = null) {
        this.mass = mass
        this.pos = pos
        this.vel = vel
        this.r = r
        this.color = 'black'
        if (hue !== null) {
            this.color = `hsl(${hue}, 100%, 40%)`
        }
        this.draw_trace = false
        this.trace = []
    }

    step(): void {
        this.pos = add(this.pos, scale(1 / TICKRATE, this.vel))
        if (this.draw_trace) {
            this.trace.push(this.pos)
        }
    }

    check_wall_collide(): void {
        if (this.pos.x - this.r < 0 && this.vel.x < 0) {
            this.pos.x = this.r
            this.vel.x *= -1
        }
        if (this.pos.x + this.r > CANVAS_SIZE && this.vel.x > 0) {
            this.pos.x = CANVAS_SIZE - this.r
            this.vel.x *= -1
        }
        if (this.pos.y - this.r < 0 && this.vel.y < 0) {
            this.pos.y = this.r
            this.vel.y *= -1
        }
        if (this.pos.y + this.r > CANVAS_SIZE && this.vel.y > 0) {
            this.pos.y = CANVAS_SIZE - this.r
            this.vel.y *= -1
        }
    }

    check_rect_collide(rect: Rectangle): void {
        const x1 = rect.x1
        const y1 = rect.y1
        const x2 = rect.x2
        const y2 = rect.y2

        const h = y2 - y1
        const w = x2 - x1

        const x0 = this.pos.x - x1
        const y0 = this.pos.y - y1

        const above_down_right = y0 < (h / w) * x0
        const above_down_left = y0 < - (h / w) * x0 + h

        // console.log('above down left', above_down_left)
        // console.log('above down right', above_down_right)

        if (x1 < this.pos.x + this.r && this.pos.x - this.r < x2) {
            // top
            if (this.pos.y + this.r > y1 && above_down_left && above_down_right) {
                // console.log('reflecting top')
                this.pos.y = y1 - this.r
                if(this.vel.y > 0) {
                    this.vel.y *= -1
                }
                return
            }
            // bottom
            if (this.pos.y - this.r < y2 && !above_down_left && !above_down_right) {
                // console.log('reflecting bottom')
                this.pos.y = y2 + this.r
                if(this.vel.y < 0) {
                    this.vel.y *= -1
                }
                return
            }
        }
        if (y1 < this.pos.y + this.r && this.pos.y - this.r < y2) {
            // left
            if (this.pos.x + this.r > x1 && above_down_left && !above_down_right) {
                // console.log('reflecting left')
                this.pos.x = x1 - this.r
                if(this.vel.x > 0) {
                    this.vel.x *= -1
                }
                return
            }
            // right
            if (this.pos.x - this.r < x2 && !above_down_left && above_down_right) {
                // console.log('reflecting right')
                this.pos.x = x2 + this.r
                if(this.vel.x < 0) {
                    this.vel.x *= -1
                }
                return
            }
        }
    }

    calc_post_collision_vel(other: Body): Vector {
        const pos_diff = sub(this.pos, other.pos)
        const pos_diff_norm = norm(pos_diff)
        const vel_diff = sub(this.vel, other.vel)
        const mass_factor = 2 * other.mass / (this.mass + other.mass)
        const vel_change = scale(mass_factor * dot(vel_diff, pos_diff) / (pos_diff_norm * pos_diff_norm), pos_diff)
        return sub(this.vel, vel_change)
    }

    check_other_collide(other: Body): void {
        if (dist(this.pos, other.pos) >= this.r + other.r) {
            return;
        }
        const pos_diff = sub(this.pos, other.pos)
        const vel_diff = sub(this.vel, other.vel)
        if (dot(vel_diff, pos_diff) >= 0) {
            return;
        }
        const vel1 = this.calc_post_collision_vel(other)
        const vel2 = other.calc_post_collision_vel(this)
        this.vel = vel1
        other.vel = vel2
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color
        ctx.strokeStyle = 'black'
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()
        ctx.closePath()

        if (!this.draw_trace || this.trace.length == 0) {
            return;
        }
        ctx.strokeStyle = 'blue'
        ctx.lineWidth = CANVAS_SIZE / 500
        ctx.beginPath()
        ctx.moveTo(this.trace[0].x, this.trace[0].y)
        for (const pos of this.trace) {
            ctx.lineTo(pos.x, pos.y)
        }
        ctx.stroke()
        ctx.closePath()
    }
}