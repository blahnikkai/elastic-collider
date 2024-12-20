import { Simulation, brownian, second_law_bodies, second_law_rects, spawn_bodies } from './simulation.js';
import { Rectangle, RectangleType } from './rectangle.js';
function main() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const step_btn = document.getElementById("step");
    const pause_btn = document.getElementById("pause");
    const play_btn = document.getElementById("play");
    const brownian_btn = document.getElementById('brownian-btn');
    const second_law_btn = document.getElementById('second-law-btn');
    const clear_btn = document.getElementById('clear-btn');
    const info_container = document.getElementById('info-container');
    // let bodies = brownian(300, 10, 150, 3)
    let walls = second_law_rects(20);
    let measures = [];
    let bodies = second_law_bodies(300, 3, 10, 100, walls);
    let simulation = new Simulation(ctx, step_btn, pause_btn, play_btn, brownian_btn, second_law_btn, clear_btn, info_container, bodies, walls, measures);
    // const bodies = [
    // new Body(10, new Vector(350, 300), new Vector(-500, -500), 10)
    // ]
    // periodic
    // let bodies = [
    //     new Body(10, new Vector(70, 250), new Vector(25, 0)),
    //     new Body(10, new Vector(250, 250), new Vector(0, 0)),
    //     new Body(10, new Vector(300, 250), new Vector(0, 0)),
    //     new Body(10, new Vector(400, 250), new Vector(-25, 0))
    // ]
    // problematic
    // let bodies = [
    //     new Body(10, new Vector(70, 250), new Vector(25, 0)),
    //     new Body(10, new Vector(250, 250), new Vector(0, 0)),
    //     new Body(10, new Vector(300, 250), new Vector(0, 0)),
    //     new Body(10, new Vector(400, 250), new Vector(-25, 0))
    // ]
    step_btn.addEventListener("click", () => simulation.step_all());
    pause_btn.addEventListener("click", () => simulation.pause());
    play_btn.addEventListener("click", () => simulation.play());
    const brownian_container = document.getElementById('brownian-container');
    const brownian_form = document.getElementById('brownian-form');
    const submit_brownian_form = (event) => {
        event.preventDefault();
        const n = parseInt(brownian_form.number.value);
        const m = parseInt(brownian_form.mass.value);
        const v = parseInt(brownian_form.velocity.value);
        const r = parseInt(brownian_form.radius.value);
        bodies = brownian(n, m, v, r);
        walls = [];
        measures = [];
        simulation.reset(bodies, walls, measures);
    };
    brownian_btn.addEventListener('click', submit_brownian_form);
    brownian_form.number.addEventListener('change', submit_brownian_form);
    brownian_form.mass.addEventListener('change', submit_brownian_form);
    brownian_form.velocity.addEventListener('change', submit_brownian_form);
    brownian_form.radius.addEventListener('change', submit_brownian_form);
    brownian_container.addEventListener('mouseover', () => {
        brownian_form.style.display = 'block';
    });
    brownian_container.addEventListener('mouseout', () => {
        brownian_form.style.display = 'none';
    });
    const second_law_container = document.getElementById('second-law-container');
    const second_law_form = document.getElementById('second-law-form');
    const submit_second_law_form = (event) => {
        event.preventDefault();
        const n = parseInt(second_law_form.number.value);
        const gap_size = parseInt(second_law_form.gap_size.value);
        const r = parseInt(second_law_form.radius.value);
        const vl = parseInt(second_law_form.vl.value);
        const vr = parseInt(second_law_form.vr.value);
        walls = second_law_rects(gap_size);
        bodies = second_law_bodies(n, r, vl, vr, walls);
        measures = [];
        simulation.reset(bodies, walls, measures);
    };
    second_law_btn.addEventListener('click', submit_second_law_form);
    second_law_form.number.addEventListener('change', submit_second_law_form);
    second_law_form.gap_size.addEventListener('change', submit_second_law_form);
    second_law_form.radius.addEventListener('change', submit_second_law_form);
    second_law_form.vl.addEventListener('change', submit_second_law_form);
    second_law_form.vr.addEventListener('change', submit_second_law_form);
    second_law_container.addEventListener('mouseover', () => {
        second_law_form.style.display = 'block';
    });
    second_law_container.addEventListener('mouseout', () => {
        second_law_form.style.display = 'none';
    });
    clear_btn.addEventListener('click', () => {
        bodies = [];
        walls = [];
        measures = [];
        simulation.reset(bodies, walls, measures);
    });
    const rect_meaning_form = document.getElementById('rect-meaning-form');
    let drawing_rect = false;
    let half_rect = [0, 0];
    const build_rect = (x, y) => {
        const clamp = (num, lo, hi) => {
            return Math.max(lo, Math.min(num, hi));
        };
        const x1 = clamp(Math.min(half_rect[0], x), 0, 500);
        const x2 = clamp(Math.max(half_rect[0], x), 0, 500);
        const y1 = clamp(Math.min(half_rect[1], y), 0, 500);
        const y2 = clamp(Math.max(half_rect[1], y), 0, 500);
        const rect_type_str = rect_meaning_form.elements['rect-meaning'].value;
        const rect_type = rect_type_str;
        return new Rectangle(x1, y1, x2, y2, rect_type);
    };
    const finish_rect = (x, y) => {
        const rect = build_rect(x, y);
        rect.color = simulation.intermediate_rect.color;
        simulation.intermediate_rect = null;
        if (rect.type === RectangleType.Wall) {
            bodies = [];
            walls.push(rect);
            simulation.reset(bodies, walls, measures);
        }
        else if (rect.type === RectangleType.Measurement) {
            measures.push(rect);
            simulation.measures = measures;
        }
        else {
            spawn_bodies(10, 1, 50, 5, rect, bodies, simulation.walls);
            simulation.bodies = bodies;
        }
    };
    const canvas_container = document.getElementById('canvas-container');
    canvas_container.addEventListener('click', (event) => {
        console.log('yeah');
        const canvas_rect = canvas.getBoundingClientRect();
        const x = event.clientX - canvas_rect.left;
        const y = event.clientY - canvas_rect.top;
        if (!drawing_rect) {
            half_rect = [x, y];
            simulation.intermediate_rect = build_rect(x, y);
        }
        else {
            finish_rect(x, y);
        }
        drawing_rect = !drawing_rect;
    });
    window.addEventListener('click', (event) => {
        if (event.target === canvas || event.target === canvas_container || !drawing_rect) {
            return;
        }
        const canvas_rect = canvas.getBoundingClientRect();
        const x = event.clientX - canvas_rect.left;
        const y = event.clientY - canvas_rect.top;
        finish_rect(x, y);
        drawing_rect = false;
    });
    window.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (drawing_rect) {
            const new_rect = build_rect(x, y);
            simulation.intermediate_rect.x1 = new_rect.x1;
            simulation.intermediate_rect.x2 = new_rect.x2;
            simulation.intermediate_rect.y1 = new_rect.y1;
            simulation.intermediate_rect.y2 = new_rect.y2;
        }
    });
    canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (drawing_rect) {
            simulation.intermediate_rect = null;
            drawing_rect = false;
            return;
        }
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        for (let i = simulation.measures.length - 1; i >= 0; i--) {
            const measure = simulation.measures[i];
            if (measure.intersect(x, y, 0)) {
                simulation.measures.splice(i, 1);
                return;
            }
        }
        for (let i = simulation.walls.length - 1; i >= 0; i--) {
            const wall = simulation.walls[i];
            if (wall.intersect(x, y, 0)) {
                simulation.walls.splice(i, 1);
                return;
            }
        }
    });
    draw_loop(simulation);
}
function draw_loop(simulation) {
    simulation.draw_all();
    window.requestAnimationFrame(() => draw_loop(simulation));
}
main();
