import { UIHandler } from './ui_handler.js';
function main() {
    const ui_handler = new UIHandler();
    draw_loop(ui_handler);
}
function draw_loop(ui_handler) {
    ui_handler.simulation.draw_all(ui_handler.ctx, ui_handler.info_container);
    window.requestAnimationFrame(() => draw_loop(ui_handler));
}
main();
