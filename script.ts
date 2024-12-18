import {Simulation, brownian, hot_and_cold} from './simulation.js'
import { Rectangle } from './rectangle.js'
import { Body } from './body.js'
import { Vector } from './vector.js'

function main() {

    const canvas = <HTMLCanvasElement>document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    const w_half = 10
    const gap_half = 10
    const rects = [
        new Rectangle(250 - w_half, 0, 250 + w_half, 250 - gap_half),
        new Rectangle(250 - w_half, 250 + gap_half, 250 + w_half, 500),
    ]

    // const bodies = brownian(300, 150, 3, rects)
    const bodies = hot_and_cold(300, 3, rects)

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

    draw_loop(simulation)
}

function draw_loop(simulation: Simulation) {
    simulation.draw_all()
    window.requestAnimationFrame(() => draw_loop(simulation))
}

main()