import {Simulation, brownian, random_number, second_law_bodies, second_law_measures, second_law_rects, spawn_bodies } from './simulation.js'
import {Rectangle, RectangleType} from './rectangle.js'
import { Body } from './body.js'
import Plotly from 'plotly.js-dist'

export class UIHandler {

    simulation: Simulation

    canvas: HTMLCanvasElement

    ctx: CanvasRenderingContext2D

    plot: HTMLDivElement

    step_btn: HTMLButtonElement
    pause_btn: HTMLButtonElement
    play_btn: HTMLButtonElement
    brownian_btn: HTMLButtonElement
    second_law_btn: HTMLButtonElement
    clear_btn: HTMLButtonElement

    measure_grid: HTMLDivElement
    canvas_container: HTMLDivElement
    bodies_subform: HTMLDivElement

    brownian_form: HTMLFormElement
    second_law_form: HTMLFormElement
    rect_meaning_form: HTMLFormElement

    brownian_container: HTMLSpanElement
    second_law_container: HTMLSpanElement
    bodies_container: HTMLSpanElement

    drawing_rect: boolean
    half_rect: number[]

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas")
        this.ctx = this.canvas.getContext("2d")
        this.plot = <HTMLDivElement>document.getElementById("plot")

        this.step_btn = <HTMLButtonElement>document.getElementById("step")
        this.pause_btn = <HTMLButtonElement>document.getElementById("pause")
        this.play_btn = <HTMLButtonElement>document.getElementById("play")
        this.brownian_btn = <HTMLButtonElement>document.getElementById('brownian-btn')
        this.second_law_btn = <HTMLButtonElement>document.getElementById('second-law-btn')
        this.clear_btn = <HTMLButtonElement>document.getElementById('clear-btn')

        this.measure_grid = <HTMLDivElement>document.getElementById('measure-grid')
        this.canvas_container = <HTMLDivElement>document.getElementById('canvas-container')
        this.bodies_subform = <HTMLDivElement>document.getElementById('bodies-subform')
        
        this.brownian_form = <HTMLFormElement>document.getElementById('brownian-form')
        this.second_law_form = <HTMLFormElement>document.getElementById('second-law-form')
        this.rect_meaning_form = <HTMLFormElement>document.getElementById('rect-meaning-form')
        
        this.brownian_container = <HTMLSpanElement>document.getElementById('brownian-container')
        this.second_law_container = <HTMLSpanElement>document.getElementById('second-law-container')
        this.bodies_container = <HTMLSpanElement>document.getElementById('bodies-container')

        this.drawing_rect = false
        this.half_rect = [0, 0]

        // let bodies = brownian(300, 10, 150, 3)
        
        let walls = second_law_rects(20)
        let measures = second_law_measures()
        let bodies = second_law_bodies(300, 3, 10, 100, walls)
        
        this.simulation = new Simulation()
        this.reset(bodies, walls, measures)
        
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
        this.add_event_listeners()
    }

    add_submit_event_listeners(form: HTMLFormElement, callback: CallableFunction): void {
        for(const element of form.elements) {
            element.addEventListener('change', (event: MouseEvent) => callback(event))
        }
    }

    reset_brownian_form(event: MouseEvent) {
        event.preventDefault()
        this.brownian_form.number.value = 300
        this.brownian_form.mass.value = 100
        this.brownian_form.velocity.value = 150
        this.brownian_form.radius.value = 3
    }

    reset_second_law_form(event: MouseEvent) {
        event.preventDefault()
        this.second_law_form.number.value = 300
        this.second_law_form.gap_size.value = 20
        this.second_law_form.radius.value = 3
        this.second_law_form.vl.value = 10
        this.second_law_form.vr.value = 100
    }

    reset_spawn_bodies_form(event: MouseEvent) {
        event.preventDefault()
        this.rect_meaning_form.number.value = 10
        this.rect_meaning_form.mass.value = 1
        this.rect_meaning_form.velocity.value = 50
        this.rect_meaning_form.radius.value = 3
    }

    add_event_listeners() {
        this.step_btn.addEventListener("click", () => this.simulation.step_all())
        this.pause_btn.addEventListener("click", () => this.pause())
        this.play_btn.addEventListener("click", () => this.play())
        
        // brownian motion
        this.brownian_btn.addEventListener('click', (event: MouseEvent) => this.submit_brownian_form(event))
        this.add_submit_event_listeners(this.brownian_form, (event: MouseEvent) => this.submit_brownian_form(event))
        this.brownian_form['reset-to-defaults'].addEventListener('click', (event: MouseEvent) => this.reset_brownian_form(event))
        this.brownian_container.addEventListener('mouseover', () => {
            this.brownian_form.style.display = 'block'
        })
        this.brownian_container.addEventListener('mouseout', () => {
            this.brownian_form.style.display = 'none'
        })
        
        // second law of thermodynamics
        this.second_law_btn.addEventListener('click', (event: MouseEvent) => this.submit_second_law_form(event))
        this.second_law_form['reset-to-defaults'].addEventListener('click', (event: MouseEvent) => this.reset_second_law_form(event))
        this.add_submit_event_listeners(this.second_law_form, (event: MouseEvent) => this.submit_second_law_form(event))
        this.second_law_container.addEventListener('mouseover', () => {
            this.second_law_form.style.display = 'block'
        })
        this.second_law_container.addEventListener('mouseout', () => {
            this.second_law_form.style.display = 'none'
        })
        
        // spawn bodies
        this.bodies_container.addEventListener('mouseover', () => {
            this.bodies_subform.style.display = 'block'
        })
        this.bodies_container.addEventListener('mouseout', () => {
            this.bodies_subform.style.display = 'none'
        })
        
        // clear
        this.clear_btn.addEventListener('click', () => {
            this.reset([], [], [])
        })

        // 
        this.rect_meaning_form['reset-to-defaults'].addEventListener('click', (event: MouseEvent) => this.reset_spawn_bodies_form(event))
        
        // rectangle drawing
        this.canvas_container.addEventListener('click', (event: MouseEvent) => this.click_canvas_container(event))
        window.addEventListener('click', (event: MouseEvent) => this.click_window(event))
        window.addEventListener('mousemove', (event: MouseEvent) => this.handle_mouse_move(event))
        this.canvas.addEventListener('contextmenu', (event: MouseEvent) => this.right_click_canvas(event))
    }

    play() {
        this.simulation.play()
        this.pause_btn.disabled = false
        this.play_btn.disabled = true
        this.step_btn.disabled = true
    }

    pause() {
        this.simulation.pause()
        this.pause_btn.disabled = true
        this.play_btn.disabled = false
        this.step_btn.disabled = false
    }

    reset(bodies: Body[], walls: Rectangle[], measures: Rectangle[]) {
        Plotly.newPlot(
            this.plot, 
            [], 
            {
                height: 350,
                width: 500,
                margin: {
                    t: 20,
                    b: 40,
                    l: 50,
                    r: 20,
                },
                xaxis: {
                    title: 'Tick'
                },
                yaxis: {
                    title: 'Mean Kinetic Energy (Joules)',
                },
            },
        )
        this.pause()
        for(const measure of measures) {
            this.add_measure_to_plot(measure)
        }
        this.simulation.reset(bodies, walls, measures)
    }

    get_mouse_coords(event: MouseEvent): number[] {
        const rect = this.canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        return [x, y]
    }

    click_canvas_container(event: MouseEvent) {
        const [x, y] = this.get_mouse_coords(event)
        if(!this.drawing_rect) {
            this.half_rect = [x, y]
            this.simulation.intermediate_rect = this.build_rect(x, y)
        }
        else {
            this.finish_rect(x, y)
        }
        this.drawing_rect = !this.drawing_rect
    }

    click_window(event: MouseEvent) {
        if(event.target === this.canvas || event.target === this.canvas_container || !this.drawing_rect) {
            return
        }
        const [x, y] = this.get_mouse_coords(event)
        this.finish_rect(x, y)
        this.drawing_rect = false
    }

    handle_mouse_move(event: MouseEvent) {
        if(!this.drawing_rect) { 
            return
        }
        const [x, y] = this.get_mouse_coords(event)
        const new_rect = this.build_rect(x, y)
        this.simulation.intermediate_rect.x1 = new_rect.x1
        this.simulation.intermediate_rect.x2 = new_rect.x2
        this.simulation.intermediate_rect.y1 = new_rect.y1
        this.simulation.intermediate_rect.y2 = new_rect.y2
    }
    
    right_click_canvas(event: MouseEvent) {
        event.preventDefault()
        if(this.simulation.intermediate_rect) {
            this.simulation.intermediate_rect = null
            this.drawing_rect = false
            return
        }
        const [x, y] = this.get_mouse_coords(event)
        let rects = []
        const rect_type_strng = this.rect_meaning_form.elements['rect-meaning'].value
        const rect_type: RectangleType = rect_type_strng as RectangleType
        if(rect_type == RectangleType.Measurement) {
            rects = this.simulation.measures
        }
        else if(rect_type == RectangleType.Wall) {
            rects = this.simulation.walls
        }
        for(let i = rects.length - 1; i >= 0; i--) {
            const rect = rects[i]
            if(rect.intersect(x, y, 0)) {
                rects.splice(i, 1)
                if(rect_type == RectangleType.Measurement) {
                    Plotly.deleteTraces(this.plot, i)
                }
                return
            }
        }

        if(rect_type == RectangleType.Delete) {
            this.build_rect(x, y)
        }
    }

    submit_brownian_form(event: Event): void {
        event.preventDefault()
        const n = parseInt(this.brownian_form.number.value)
        const m = parseInt(this.brownian_form.mass.value)
        const v = parseInt(this.brownian_form.velocity.value)
        const r = parseInt(this.brownian_form.radius.value)
        
        const bodies = brownian(n, m, v, r)
        this.reset(bodies, [], [])
    }
    
    submit_second_law_form(event: Event): void {
        event.preventDefault()
        const n = parseInt(this.second_law_form.number.value)
        const gap_size = parseInt(this.second_law_form.gap_size.value)
        const r = parseInt(this.second_law_form.radius.value)
        const vl = parseInt(this.second_law_form.vl.value)
        const vr = parseInt(this.second_law_form.vr.value)
        
        const walls = second_law_rects(gap_size)
        const measures = second_law_measures()
        const bodies = second_law_bodies(n, r, vl, vr, walls)
        this.reset(bodies, walls, measures)
    }
    
    add_measure_to_plot(rect: Rectangle): void {
        Plotly.addTraces(
            this.plot, 
            {
                x: rect.tick_lst,
                y: rect.mean_energy_lst,
                mode: 'lines',
                line: {
                    color: `hsl(${rect.color[0]}, ${rect.color[1]}%, 70%)`
                }
            }
        )
    }
    
    build_rect(x: number, y: number): Rectangle {
        const clamp = (num: number, lo: number, hi: number) => {
            return Math.max(lo, Math.min(num, hi))
        }
        const x1 = clamp(Math.min(this.half_rect[0], x), 0, 500)
        const x2 = clamp(Math.max(this.half_rect[0], x), 0, 500)
        const y1 = clamp(Math.min(this.half_rect[1], y), 0, 500)
        const y2 = clamp(Math.max(this.half_rect[1], y), 0, 500)
        
        const rect_type_str: string = this.rect_meaning_form.elements['rect-meaning'].value
        const rect_type: RectangleType = rect_type_str as RectangleType
        
        let hue = null
        if(rect_type == RectangleType.Measurement 
            || rect_type == RectangleType.Spawn && this.rect_meaning_form['random-color'].checked) {
            hue = random_number(0, 360)
        }
        return new Rectangle(x1, y1, x2, y2, rect_type, hue)
    }

    finish_rect(x: number, y: number): void {
        const rect: Rectangle = this.build_rect(x, y)
        rect.color = this.simulation.intermediate_rect.color
        this.simulation.intermediate_rect = null
        if(rect.type == RectangleType.Wall) {
            this.simulation.walls.push(rect)
            this.reset([], this.simulation.walls, this.simulation.measures)
        }
        else if(rect.type == RectangleType.Measurement) {
            this.add_measure_to_plot(rect)
            this.simulation.measures.push(rect)
        }
        else if(rect.type == RectangleType.Spawn) {
            const n = parseInt(this.rect_meaning_form.number.value)
            const m = parseInt(this.rect_meaning_form.mass.value)
            const v = parseInt(this.rect_meaning_form.velocity.value)
            const r = parseInt(this.rect_meaning_form.radius.value)
            
            let hue = null
            if(this.rect_meaning_form['random-color'].checked) {
                hue = rect.color[0]
            }
            this.simulation.bodies = spawn_bodies(n, m, v, r, rect, this.simulation.bodies, this.simulation.walls, hue)

        }
        else {

            this.simulation.delete_bodies(rect)
        }
    }

}
