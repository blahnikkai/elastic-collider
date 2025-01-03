import {UIHandler} from './ui_handler.js'

function main() {
    const ui_handler = new UIHandler()
    draw_loop(ui_handler)
}

function draw_loop(ui_handler: UIHandler) {
    ui_handler.simulation.draw_all(ui_handler.ctx, ui_handler.measure_grid, ui_handler.plot)
    window.requestAnimationFrame(() => draw_loop(ui_handler))
}

main()
