import { Simulation, brownian } from './simulation.js';
function main() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const bodies = brownian(300, 20, 3);
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
    let simulation = new Simulation(ctx, bodies);
    simulation.draw_all();
    const step_btn = document.getElementById("step");
    step_btn.addEventListener("click", () => simulation.step_all());
    const play_btn = document.getElementById("play");
    play_btn.addEventListener("click", () => {
        simulation.playing = true;
        simulation.step_all();
    });
    const pause_btn = document.getElementById("pause");
    pause_btn.addEventListener("click", () => {
        simulation.playing = false;
    });
}
main();
