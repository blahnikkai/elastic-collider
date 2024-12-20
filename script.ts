import {Simulation, brownian, second_law_bodies, second_law_rects, spawn_bodies } from './simulation.js'
import {Rectangle, RectangleType} from './rectangle.js'
import {UIHandler} from './ui_handler.js'

function main() {
    const ui_handler = new UIHandler()
    draw_loop(ui_handler.simulation)
}

function draw_loop(simulation: Simulation) {
    simulation.draw_all()
    window.requestAnimationFrame(() => draw_loop(simulation))
}

main()
