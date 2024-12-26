import { Body } from './body.js';
import { Rectangle, RectangleType } from './rectangle.js';
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
function random_spawn(low, high, r) {
    if (high - low > 2 * r) {
        return random_number(low + r, high - r);
    }
    return random_number(low, high);
}
export function random_number(low, high) {
    return (high - low) * Math.random() + low;
}
function generate_random_body(bodies, rects, m, v, r, hue = null, x1 = 0, x2 = 500, y1 = 0, y2 = 500) {
    while (true) {
        const x = random_spawn(x1, x2, r);
        const y = random_spawn(y1, y2, r);
        const theta = 2 * Math.PI * Math.random();
        const vx = v * Math.cos(theta);
        const vy = v * Math.sin(theta);
        if (!check_collides_existing_bodies(bodies, x, y, r) && !check_collides_existing_rects(rects, x, y, r)) {
            return new Body(m, new Vector(x, y), new Vector(vx, vy), r, hue);
        }
    }
}
export function spawn_bodies(n, m, v, r, spawn_rect, bodies, walls) {
    const hue = random_number(0, 360);
    for (let i = 0; i < n; i++) {
        bodies.push(generate_random_body(bodies, walls, m, v, r, hue, spawn_rect.x1, spawn_rect.x2, spawn_rect.y1, spawn_rect.y2));
    }
}
// number
// size
// mass
// energy
export function brownian(n, m, v, r) {
    let bodies = [];
    bodies.push(generate_random_body(bodies, [], m, 0, 30));
    for (let i = 0; i < n; i++) {
        bodies.push(generate_random_body(bodies, [], 1, v, r));
    }
    bodies[0].color = 'red';
    bodies[0].is_traced = true;
    bodies[1].color = 'red';
    return bodies;
}
export function second_law_rects(gap_size) {
    const w_half = 10;
    const gap_half = gap_size / 2;
    let rects = [
        new Rectangle(250 - w_half, 0, 250 + w_half, 250 - gap_half),
        new Rectangle(250 - w_half, 250 + gap_half, 250 + w_half, 500),
    ];
    return rects;
}
export function second_law_measures() {
    const left_measure = new Rectangle(0, 0, 250, 500, RectangleType.Measurement, 240);
    const right_measure = new Rectangle(250, 0, 500, 500, RectangleType.Measurement, 0);
    return [left_measure, right_measure];
}
export function second_law_bodies(n, r, vl, vr, rects) {
    let bodies = [];
    for (let i = 0; i < n; i++) {
        bodies.push(generate_random_body(bodies, rects, 1, vl, r, 240, 0, 240));
    }
    for (let i = 0; i < n; i++) {
        bodies.push(generate_random_body(bodies, rects, 1, vr, r, 0, 260, 500));
    }
    return bodies;
}
export class Simulation {
    constructor() {
        this.bodies = [];
        this.walls = [];
        this.measures = [];
        this.tick = 0;
        this.intermediate_rect = null;
    }
    reset(bodies, walls, measures) {
        this.pause();
        this.bodies = bodies;
        this.tick = 0;
        this.walls = walls;
        this.measures = measures;
        this.intermediate_rect = null;
    }
    play() {
        this.playing = true;
        this.step_all();
    }
    pause() {
        this.playing = false;
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
            for (const rect of this.walls) {
                body.check_rect_collide(rect);
            }
        }
        if (this.playing) {
            setTimeout(() => this.step_all(), 1000 / TICKRATE);
        }
    }
    draw_all(ctx, info_grid) {
        ctx.clearRect(0, 0, 500, 500);
        for (const body of this.bodies) {
            body.draw(ctx);
        }
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        ctx.fillText(this.calc_energy().toString(), 20, 20);
        ctx.fillText(this.tick.toString(), 20, 40);
        for (const wall of this.walls) {
            wall.draw(ctx);
        }
        let info_html = '';
        info_html += `<div>`;
        info_html += 'Total Kinetic Energy';
        info_html += '</div>';
        info_html += `<div>`;
        info_html += 'Body Count';
        info_html += '</div>';
        info_html += `<div>`;
        info_html += 'Mean Kinetic Energy (Temperature)';
        info_html += '</div>';
        for (const measure of this.measures) {
            const energy = this.calc_energy(measure.x1, measure.x2, measure.y1, measure.y2);
            const body_cnt = this.count_bodies(measure.x1, measure.x2, measure.y1, measure.y2);
            const hsl_color = `style="color:hsl(${measure.color[0]}, ${measure.color[1]}%, ${measure.color[2]}%"`;
            info_html += `<div ${hsl_color}">`;
            info_html += energy.toFixed(2);
            info_html += '</div>';
            info_html += `<div ${hsl_color}">`;
            info_html += body_cnt;
            info_html += '</div>';
            info_html += `<div ${hsl_color}">`;
            info_html += (energy / body_cnt).toFixed(2);
            info_html += '</div>';
            measure.draw(ctx);
        }
        info_grid.innerHTML = info_html;
        if (this.intermediate_rect != null) {
            this.intermediate_rect.draw(ctx);
        }
    }
    count_bodies(x1 = 0, x2 = 500, y1 = 0, y2 = 500) {
        let cnt = 0;
        for (const body of this.bodies) {
            if (x1 < body.pos.x && body.pos.x < x2 && y1 < body.pos.y && body.pos.y < y2) {
                cnt += 1;
            }
        }
        return cnt;
    }
    calc_energy(x1 = 0, x2 = 500, y1 = 0, y2 = 500) {
        let energy = 0;
        for (const body of this.bodies) {
            if (x1 < body.pos.x && body.pos.x < x2 && y1 < body.pos.y && body.pos.y < y2) {
                energy += .5 * body.mass * Math.pow(norm(body.vel), 2);
            }
        }
        return energy;
    }
}
