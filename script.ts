import {Simulation, brownian, hot_and_cold} from './simulation.js'
import { Rectangle } from './rectangle.js'
import { Body } from './body.js'
import { Vector } from './vector.js'
import { PollingWatchKind } from './node_modules/typescript/lib/typescript.js'

function main() {

    const canvas = <HTMLCanvasElement>document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    const w_half = 10
    const gap_half = 10
    let rects = [
        new Rectangle(250 - w_half, 0, 250 + w_half, 250 - gap_half),
        new Rectangle(250 - w_half, 250 + gap_half, 250 + w_half, 500),
    ]

    let bodies = brownian(300, 10, 150, 3, rects)
    // let bodies = hot_and_cold(300, 3, rects)

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

    let simulation = new Simulation(ctx, bodies, rects)

    const step_btn = <HTMLButtonElement>document.getElementById("step")
    step_btn.addEventListener("click", () => simulation.step_all())
    const play_btn = <HTMLButtonElement>document.getElementById("play")
    play_btn.addEventListener("click", () => {
        simulation.playing = true
        simulation.step_all()
        play_btn.disabled = true
        pause_btn.disabled = false
        step_btn.disabled = true
    })
    const pause_btn = <HTMLButtonElement>document.getElementById("pause")
    pause_btn.addEventListener("click", () => {
        simulation.playing = false
        pause_btn.disabled = true
        play_btn.disabled = false
        step_btn.disabled = false
    })
    const brownian_btn = <HTMLButtonElement>document.getElementById('brownian')
    const brownian_container = <HTMLButtonElement>document.getElementById('brownian-container')
    const brownian_form = <HTMLFormElement>document.getElementById('brownian-form')
    brownian_form.style.display = 'none'

    const submit_form = (event) => {
        event.preventDefault()
        console.log(brownian_form.number.value)
        const n = parseInt(brownian_form.number.value)
        const m = parseInt(brownian_form.mass.value)
        const v = parseInt(brownian_form.velocity.value)
        const r = parseInt(brownian_form.radius.value)
        
        bodies = brownian(n, m, v, r, rects)
        rects = []
        simulation.reset(bodies, rects)
        pause_btn.disabled = true
        play_btn.disabled = false
        step_btn.disabled = false
    }
    brownian_form.number.addEventListener('change', submit_form)
    brownian_form.mass.addEventListener('change', submit_form)
    brownian_form.velocity.addEventListener('change', submit_form)
    brownian_form.radius.addEventListener('change', submit_form)

    brownian_container.addEventListener('mouseover', () => {
        brownian_form.style.display = 'block'
    })
    brownian_container.addEventListener('mouseout', () => {
        brownian_form.style.display = 'none'
    })

    // number
    // energy
    // mass
    // size

    draw_loop(simulation)
}

function draw_loop(simulation: Simulation) {
    simulation.draw_all()
    window.requestAnimationFrame(() => draw_loop(simulation))
}

main()