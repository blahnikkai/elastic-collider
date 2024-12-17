import {dist, add, scale, sub, dot, norm, Vector} from './vector.js'
import {TICKRATE} from './simulation.js'

export class Body {

    mass: number
    pos: Vector
    vel: Vector
    r: number
    color: string
    is_traced: boolean
    trace: Vector[]

    constructor(mass: number, pos: Vector, vel: Vector, r: number, color: string = 'black', is_traced: boolean = false) {
        this.mass = mass
        this.pos = pos
        this.vel = vel
        this.r = r
        this.color = color
        this.is_traced = is_traced
        this.trace = []
    }

    step(): void {
        this.pos = add(this.pos, scale(1 / TICKRATE, this.vel))
        if(this.is_traced) {
            this.trace.push(this.pos)
        }
    }

    check_wall_collide(): void {
        if(this.pos.x - this.r < 0 && this.vel.x < 0) {
            this.pos.x = this.r
            this.vel.x *= -1
        }
        if(this.pos.x + this.r > 500 && this.vel.x > 0) {
            this.pos.x = 500 - this.r
            this.vel.x *= -1
        }
        if(this.pos.y - this.r < 0 && this.vel.y < 0) {
            this.pos.y = this.r
            this.vel.y *= -1
        }
        if(this.pos.y + this.r > 500 && this.vel.y > 0) {
            this.pos.y = 500 - this.r
            this.vel.y *= -1
        }
    }

    check_rect_collide(rect: number[]): void {
        const [x1, y1, x2, y2] = rect
        
        const h = y2 - y1
        const w = x2 - x1

        const x0 = this.pos.x - x1
        const y0 = this.pos.y - y1

        const above_down_right = y0 < (h / w) * x0
        const above_down_left = y0 < - (h / w) * x0 + h
        
        // console.log('above down left', above_down_left)
        // console.log('above down right', above_down_right)

        if(x1 < this.pos.x + this.r && this.pos.x - this.r < x2) {
            // top
            if(this.pos.y + this.r > y1 && this.vel.y > 0 && above_down_left && above_down_right) {
                // console.log('reflecting top')
                this.vel.y *= -1
                this.pos.y = y1 - this.r
                return
            }
            // bottom
            if(this.pos.y - this.r < y2 && this.vel.y < 0 && !above_down_left && !above_down_right) {
                // console.log('reflecting bottom')
                this.vel.y *= -1
                this.pos.y = y2 + this.r
                return
            }
        }
        if(y1 < this.pos.y + this.r && this.pos.y - this.r < y2) {
            // left
            if(this.pos.x + this.r > x1 && this.vel.x > 0 && above_down_left && !above_down_right) {
                // console.log('reflecting left')
                this.vel.x *= -1
                this.pos.x = x1 - this.r
                return
            }
            // right
            if(this.pos.x - this.r < x2 && this.vel.x < 0 && !above_down_left && above_down_right) {
                // console.log('reflecting right')
                this.vel.x *= -1
                this.pos.x = x2 + this.r
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
        if(dist(this.pos, other.pos) >= this.r + other.r) {
            return;
        }
        const pos_diff = sub(this.pos, other.pos)
        const vel_diff = sub(this.vel, other.vel)
        if(dot(vel_diff, pos_diff) >= 0) {
            return;
        }
        const vel1 = this.calc_post_collision_vel(other)
        const vel2 = other.calc_post_collision_vel(this)
        this.vel = vel1
        other.vel = vel2
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color
        ctx.strokeStyle = this.color
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
        
        ctx.strokeStyle = 'blue'
        ctx.beginPath()
        if(!this.is_traced || this.trace.length == 0) {
            return;
        }
        ctx.moveTo(this.trace[0].x, this.trace[0].y)
        for(const pos of this.trace) {
            ctx.lineTo(pos.x, pos.y)
        }
        ctx.stroke()
        ctx.closePath()
    }
}