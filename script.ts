import {Simulation, brownian, hot_and_cold} from './simulation.js'
import { Rectangle } from './rectangle.js'

function main() {

    const canvas = <HTMLCanvasElement>document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    const rects = [
        new Rectangle(240, 0, 265, 240),
        new Rectangle(240, 255, 265, 500),
    ]

    // const bodies = brownian(300, 150, 3, rects)
    const bodies = hot_and_cold(300, 3, rects)

    // const bodies = [
    //     new Body(10, new Vector(350, 300), new Vector(-500, -500), 10)
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

    const step_btn = document.getElementById("step")
    step_btn.addEventListener("click", () => simulation.step_all())
    const play_btn = document.getElementById("play")
    play_btn.addEventListener("click", () => {
        simulation.playing = true
        simulation.step_all()
    })
    const pause_btn = document.getElementById("pause")
    pause_btn.addEventListener("click", () => {
        simulation.playing = false
    })

    draw_loop(simulation)
}

function draw_loop(simulation: Simulation) {
    simulation.draw_all()
    window.requestAnimationFrame(() => draw_loop(simulation))
}

main()