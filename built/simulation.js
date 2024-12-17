import { Body } from './body.js';
import { Vector, dist, norm } from './vector.js';
export const TICKRATE = 50;
function check_collides_existing_bodies(bodies, x, y, r) {
    for (const body of bodies) {
        if (dist(new Vector(x, y), body.pos) < body.r + r) {
            return true;
        }
    }
    return false;
}
function check_collides_existing_rects(rects, x, y, r) {
    for (const rect of rects) {
        if (rect.intersect(x, y, r)) {
            return true;
        }
    }
    return false;
}
function generate_random_body(bodies, rects, r, v, m) {
    while (true) {
        const x = (500 - 2 * r) * Math.random() + r;
        const y = (500 - 2 * r) * Math.random() + r;
        if (!check_collides_existing_bodies(bodies, x, y, r) && !check_collides_existing_rects(rects, x, y, r)) {
            return new Body(m, new Vector(x, y), new Vector(v, v), r);
        }
    }
}
export function brownian(n, v, r, rects) {
    let bodies = [];
    bodies.push(generate_random_body(bodies, rects, 30, 0, 100));
    for (let i = 0; i < n; i++) {
        bodies.push(generate_random_body(bodies, rects, r, v, 1));
    }
    bodies[0].color = 'red';
    bodies[1].color = 'red';
    return bodies;
}
export class Simulation {
    constructor(ctx, bodies, rectangles) {
        this.ctx = ctx;
        this.playing = false;
        this.bodies = bodies;
        this.tick = 0;
        this.rectangles = rectangles;
    }
    step_all() {
        this.tick += 1;
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                this.bodies[i].check_other_collide(this.bodies[j]);
            }
        }
        for (const body of this.bodies) {
            body.step();
        }
        for (const body of this.bodies) {
            body.check_wall_collide();
            for (const rect of this.rectangles) {
                body.check_rect_collide(rect);
            }
        }
        if (this.playing) {
            setTimeout(() => this.step_all(), 1000 / TICKRATE);
        }
    }
    draw_all() {
        this.ctx.clearRect(0, 0, 500, 500);
        for (const body of this.bodies) {
            body.draw(this.ctx);
        }
        const energy = this.calc_energy();
        this.ctx.fillStyle = 'black';
        this.ctx.strokeStyle = 'black';
        this.ctx.fillText(energy.toString(), 20, 20);
        this.ctx.fillText(this.tick.toString(), 20, 40);
        for (const rectangle of this.rectangles) {
            rectangle.draw(this.ctx);
        }
    }
    calc_energy() {
        let energy = 0;
        for (const body of this.bodies) {
            energy += .5 * body.mass * Math.pow(norm(body.vel), 2);
        }
        return energy;
    }
}
