import { UIHandler } from './ui_handler.js';
function main() {
    const ui_handler = new UIHandler();
    draw_loop(ui_handler.simulation);
}
function draw_loop(simulation) {
    simulation.draw_all();
    window.requestAnimationFrame(() => draw_loop(simulation));
}
main();
