import { dist, add, scale, sub, dot, norm } from './vector.js';
import { TICKRATE } from './simulation.js';
export class Body {
    constructor(mass, pos, vel, r, color = 'black', is_traced = false) {
        this.mass = mass;
        this.pos = pos;
        this.vel = vel;
        this.r = r;
        this.color = color;
        this.is_traced = is_traced;
        this.trace = [];
    }
    step() {
        this.pos = add(this.pos, scale(1 / TICKRATE, this.vel));
        if (this.is_traced) {
            this.trace.push(this.pos);
        }
        this.check_wall_collide();
    }
    check_wall_collide() {
        if (this.pos.x - this.r < 0 && this.vel.x < 0) {
            this.pos.x = this.r;
            this.vel.x *= -1;
        }
        if (this.pos.x + this.r > 500 && this.vel.x > 0) {
            this.pos.x = 500 - this.r;
            this.vel.x *= -1;
        }
        if (this.pos.y - this.r < 0 && this.vel.y < 0) {
            this.pos.y = this.r;
            this.vel.y *= -1;
        }
        if (this.pos.y + this.r > 500 && this.vel.y > 0) {
            this.pos.y = 500 - this.r;
            this.vel.y *= -1;
        }
    }
    calc_post_collision_vel(other) {
        const pos_diff = sub(this.pos, other.pos);
        const pos_diff_norm = norm(pos_diff);
        const vel_diff = sub(this.vel, other.vel);
        const mass_factor = 2 * other.mass / (this.mass + other.mass);
        const vel_change = scale(mass_factor * dot(vel_diff, pos_diff) / (pos_diff_norm * pos_diff_norm), pos_diff);
        return sub(this.vel, vel_change);
    }
    check_other_collide(other) {
        if (dist(this.pos, other.pos) >= this.r + other.r) {
            return;
        }
        const pos_diff = sub(this.pos, other.pos);
        const vel_diff = sub(this.vel, other.vel);
        if (dot(vel_diff, pos_diff) >= 0) {
            return;
        }
        const vel1 = this.calc_post_collision_vel(other);
        const vel2 = other.calc_post_collision_vel(this);
        this.vel = vel1;
        other.vel = vel2;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        if (!this.is_traced || this.trace.length == 0) {
            return;
        }
        ctx.moveTo(this.trace[0].x, this.trace[0].y);
        for (const pos of this.trace) {
            ctx.lineTo(pos.x, pos.y);
        }
        ctx.stroke();
        ctx.closePath();
    }
}
