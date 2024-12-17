import { Body } from './body.js';
import { Vector, dist, norm } from './vector.js';
function check_collides_existing(bodies, x, y, r) {
    for (const body of bodies) {
        if (dist(new Vector(x, y), body.pos) < body.r + r) {
            return true;
        }
    }
    return false;
}
export function brownian(n, v, r) {
    let bodies = [];
    bodies.push(new Body(100, new Vector(250, 250), new Vector(0, 0), 30, 'red', true));
    for (let i = 0; i < n; i++) {
        while (true) {
            const x = (500 - 2 * r) * Math.random() + r;
            const y = (500 - 2 * r) * Math.random() + r;
            if (!check_collides_existing(bodies, x, y, r)) {
                let color = 'black';
                if (i < 1) {
                    color = 'red';
                }
                bodies.push(new Body(1, new Vector(x, y), new Vector(v, v), r, color));
                break;
            }
        }
    }
    return bodies;
}
export class Simulation {
    constructor(ctx, bodies) {
        this.ctx = ctx;
        this.playing = false;
        this.bodies = bodies;
    }
    step_all() {
        this.ctx.clearRect(0, 0, 500, 500);
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                this.bodies[i].check_other_collide(this.bodies[j]);
            }
        }
        for (const body of this.bodies) {
            body.step();
        }
        this.draw_all();
        if (this.playing) {
            window.requestAnimationFrame(() => this.step_all());
        }
    }
    draw_all() {
        for (const body of this.bodies) {
            body.draw(this.ctx);
        }
        const energy = this.calc_energy();
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(energy.toString(), 20, 20);
    }
    calc_energy() {
        let energy = 0;
        for (const body of this.bodies) {
            energy += .5 * body.mass * Math.pow(norm(body.vel), 2);
        }
        return energy;
    }
}
