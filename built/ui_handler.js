import { Simulation, random_number, second_law_bodies, second_law_measures, second_law_rects } from './simulation.js';
import { Rectangle, RectangleType } from './rectangle.js';
export class UIHandler {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.step_btn = document.getElementById("step");
        this.pause_btn = document.getElementById("pause");
        this.play_btn = document.getElementById("play");
        this.brownian_btn = document.getElementById('brownian-btn');
        this.second_law_btn = document.getElementById('second-law-btn');
        this.clear_btn = document.getElementById('clear-btn');
        this.info_grid = document.getElementById('info-grid');
        this.canvas_container = document.getElementById('canvas-container');
        this.bodies_subform = document.getElementById('bodies-subform');
        this.brownian_form = document.getElementById('brownian-form');
        this.second_law_form = document.getElementById('second-law-form');
        this.rect_meaning_form = document.getElementById('rect-meaning-form');
        this.brownian_container = document.getElementById('brownian-container');
        this.second_law_container = document.getElementById('second-law-container');
        this.bodies_container = document.getElementById('bodies-container');
        this.drawing_rect = false;
        this.half_rect = [0, 0];
        // let bodies = brownian(300, 10, 150, 3)
        let walls = second_law_rects(20);
        let measures = second_law_measures();
        let bodies = second_law_bodies(300, 3, 10, 100, walls);
        this.simulation = new Simulation();
        this.reset(bodies, walls, measures);
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
        this.add_event_listeners();
    }
    add_submit_event_listeners(form, callback) {
        for (const element of form.elements) {
            element.addEventListener('change', (event) => callback(event));
        }
    }
    reset_brownian_form(event) {
        event.preventDefault();
        this.brownian_form.number.value = 300;
        this.brownian_form.mass.value = 100;
        this.brownian_form.velocity.value = 150;
        this.brownian_form.radius.value = 3;
    }
    reset_second_law_form(event) {
        event.preventDefault();
        this.second_law_form.number.value = 300;
        this.second_law_form.gap_size.value = 20;
        this.second_law_form.radius.value = 3;
        this.second_law_form.vl.value = 10;
        this.second_law_form.vr.value = 100;
    }
    reset_spawn_bodies_form(event) {
        event.preventDefault();
        this.rect_meaning_form.number.value = 10;
        this.rect_meaning_form.mass.value = 1;
        this.rect_meaning_form.velocity.value = 50;
        this.rect_meaning_form.radius.value = 3;
    }
    add_event_listeners() {
        this.step_btn.addEventListener("click", () => this.simulation.step_all(false));
        this.pause_btn.addEventListener("click", () => this.pause());
        this.play_btn.addEventListener("click", () => this.play());
        // brownian motion
        this.brownian_btn.addEventListener('click', (event) => this.submit_brownian_form(event));
        this.add_submit_event_listeners(this.brownian_form, (event) => this.submit_brownian_form(event));
        this.brownian_form['reset-to-defaults'].addEventListener('click', (event) => this.reset_brownian_form(event));
        this.brownian_container.addEventListener('mouseover', () => {
            this.brownian_form.style.display = 'block';
        });
        this.brownian_container.addEventListener('mouseout', () => {
            this.brownian_form.style.display = 'none';
        });
        // second law of thermodynamics
        this.second_law_btn.addEventListener('click', (event) => this.submit_second_law_form(event));
        this.second_law_form['reset-to-defaults'].addEventListener('click', (event) => this.reset_second_law_form(event));
        this.add_submit_event_listeners(this.second_law_form, (event) => this.submit_second_law_form(event));
        this.second_law_container.addEventListener('mouseover', () => {
            this.second_law_form.style.display = 'block';
        });
        this.second_law_container.addEventListener('mouseout', () => {
            this.second_law_form.style.display = 'none';
        });
        // spawn bodies
        this.bodies_container.addEventListener('mouseover', () => {
            this.bodies_subform.style.display = 'block';
        });
        this.bodies_container.addEventListener('mouseout', () => {
            this.bodies_subform.style.display = 'none';
        });
        // clear
        this.clear_btn.addEventListener('click', () => {
            this.reset([], [], []);
        });
        // 
        this.rect_meaning_form['reset-to-defaults'].addEventListener('click', (event) => this.reset_spawn_bodies_form(event));
        // rectangle drawing
        this.canvas_container.addEventListener('click', (event) => this.click_canvas_container(event));
        window.addEventListener('click', (event) => this.click_window(event));
        window.addEventListener('mousemove', (event) => this.handle_mouse_move(event));
        this.canvas.addEventListener('contextmenu', (event) => this.right_click_canvas(event));
    }
    play() {
        this.simulation.play();
        this.pause_btn.disabled = false;
        this.play_btn.disabled = true;
        this.step_btn.disabled = true;
    }
    pause() {
        this.simulation.pause();
        this.pause_btn.disabled = true;
        this.play_btn.disabled = false;
        this.step_btn.disabled = false;
    }
    brownian(n, m, v, r) {
        this.simulation.brownian(n, m, v, r);
        this.pause();
    }
    second_law(n, gap_size, r, vl, vr) {
        this.simulation.second_law(n, gap_size, r, vl, vr);
        this.pause();
    }
    reset(bodies, walls, measures) {
        this.pause();
        this.simulation.reset(bodies, walls, measures);
    }
    get_mouse_coords(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return [x, y];
    }
    click_canvas_container(event) {
        const [x, y] = this.get_mouse_coords(event);
        if (!this.drawing_rect) {
            this.half_rect = [x, y];
            this.simulation.intermediate_rect = this.build_rect(x, y);
        }
        else {
            this.finish_rect(x, y);
        }
        this.drawing_rect = !this.drawing_rect;
    }
    click_window(event) {
        if (event.target === this.canvas || event.target === this.canvas_container || !this.drawing_rect) {
            return;
        }
        const [x, y] = this.get_mouse_coords(event);
        this.finish_rect(x, y);
        this.drawing_rect = false;
    }
    handle_mouse_move(event) {
        if (!this.drawing_rect) {
            return;
        }
        const [x, y] = this.get_mouse_coords(event);
        const new_rect = this.build_rect(x, y);
        this.simulation.intermediate_rect.x1 = new_rect.x1;
        this.simulation.intermediate_rect.x2 = new_rect.x2;
        this.simulation.intermediate_rect.y1 = new_rect.y1;
        this.simulation.intermediate_rect.y2 = new_rect.y2;
    }
    right_click_canvas(event) {
        event.preventDefault();
        if (this.simulation.intermediate_rect) {
            this.simulation.intermediate_rect = null;
            this.drawing_rect = false;
            return;
        }
        const [x, y] = this.get_mouse_coords(event);
        let rects = [];
        const rect_type_strng = this.rect_meaning_form.elements['rect-meaning'].value;
        const rect_type = rect_type_strng;
        if (rect_type === RectangleType.Measurement) {
            rects = this.simulation.measures;
        }
        else if (rect_type === RectangleType.Wall) {
            rects = this.simulation.walls;
        }
        for (let i = rects.length - 1; i >= 0; i--) {
            const rect = rects[i];
            if (rect.intersect(x, y, 0)) {
                rects.splice(i, 1);
                return;
            }
        }
    }
    submit_brownian_form(event) {
        event.preventDefault();
        const n = parseInt(this.brownian_form.number.value);
        const m = parseInt(this.brownian_form.mass.value);
        const v = parseInt(this.brownian_form.velocity.value);
        const r = parseInt(this.brownian_form.radius.value);
        this.brownian(n, m, v, r);
    }
    submit_second_law_form(event) {
        event.preventDefault();
        const n = parseInt(this.second_law_form.number.value);
        const gap_size = parseInt(this.second_law_form.gap_size.value);
        const r = parseInt(this.second_law_form.radius.value);
        const vl = parseInt(this.second_law_form.vl.value);
        const vr = parseInt(this.second_law_form.vr.value);
        this.second_law(n, gap_size, r, vl, vr);
    }
    build_rect(x, y) {
        const clamp = (num, lo, hi) => {
            return Math.max(lo, Math.min(num, hi));
        };
        const x1 = clamp(Math.min(this.half_rect[0], x), 0, 500);
        const x2 = clamp(Math.max(this.half_rect[0], x), 0, 500);
        const y1 = clamp(Math.min(this.half_rect[1], y), 0, 500);
        const y2 = clamp(Math.max(this.half_rect[1], y), 0, 500);
        const rect_type_str = this.rect_meaning_form.elements['rect-meaning'].value;
        const rect_type = rect_type_str;
        let hue = null;
        if (rect_type == RectangleType.Measurement
            || rect_type == RectangleType.Spawn && this.rect_meaning_form['random-color'].checked) {
            hue = random_number(0, 360);
        }
        return new Rectangle(x1, y1, x2, y2, rect_type, hue);
    }
    finish_rect(x, y) {
        const rect = this.build_rect(x, y);
        rect.color = this.simulation.intermediate_rect.color;
        this.simulation.intermediate_rect = null;
        if (rect.type === RectangleType.Wall) {
            this.simulation.walls.push(rect);
            this.reset([], this.simulation.walls, this.simulation.measures);
        }
        else if (rect.type === RectangleType.Measurement) {
            this.simulation.measures.push(rect);
        }
        else {
            const n = parseInt(this.rect_meaning_form.number.value);
            const m = parseInt(this.rect_meaning_form.mass.value);
            const v = parseInt(this.rect_meaning_form.velocity.value);
            const r = parseInt(this.rect_meaning_form.radius.value);
            let hue = null;
            if (this.rect_meaning_form['random-color'].checked) {
                hue = rect.color[0];
            }
            this.simulation.spawn_bodies(n, m, v, r, rect, hue);
        }
    }
}
