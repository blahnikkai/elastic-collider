import {Simulation, brownian, second_law_bodies, second_law_rects } from './simulation.js'
import { Rectangle } from './rectangle.js'
import { Body } from './body.js'
import { Vector } from './vector.js'

function main() {

    const canvas = <HTMLCanvasElement>document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    // let bodies = brownian(300, 10, 150, 3)
    let rects = second_law_rects(10)
    let bodies = second_law_bodies(300, 3, 10, 100, rects)
    let simulation = new Simulation(ctx, bodies, rects)    

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
    
    const brownian_container = document.getElementById('brownian-container')
    const brownian_form = <HTMLFormElement>document.getElementById('brownian-form')
    const brownian_btn = <HTMLButtonElement>document.getElementById('brownian-btn')
    const submit_brownian_form = (event: Event) => {
        event.preventDefault()
        console.log(brownian_form.number.value)
        const n = parseInt(brownian_form.number.value)
        const m = parseInt(brownian_form.mass.value)
        const v = parseInt(brownian_form.velocity.value)
        const r = parseInt(brownian_form.radius.value)
        
        bodies = brownian(n, m, v, r)
        simulation.reset(bodies, [])
        pause_btn.disabled = true
        play_btn.disabled = false
        step_btn.disabled = false
    }
    brownian_btn.addEventListener('click', submit_brownian_form)
    brownian_form.number.addEventListener('change', submit_brownian_form)
    brownian_form.mass.addEventListener('change', submit_brownian_form)
    brownian_form.velocity.addEventListener('change', submit_brownian_form)
    brownian_form.radius.addEventListener('change', submit_brownian_form)
    brownian_container.addEventListener('mouseover', () => {
        brownian_form.style.display = 'block'
    })
    brownian_container.addEventListener('mouseout', () => {
        brownian_form.style.display = 'none'
    })

    const second_law_container = document.getElementById('second-law-container')
    const second_law_form = <HTMLFormElement>document.getElementById('second-law-form')
    const second_law_btn = <HTMLButtonElement>document.getElementById('second-law-btn')
    const submit_second_law_form = (event: Event) => {
        event.preventDefault()
        console.log(second_law_form.number.value)
        const n = parseInt(second_law_form.number.value)
        const gap_size = parseInt(second_law_form.gap_size.value)
        const r = parseInt(second_law_form.radius.value)
        const vl = parseInt(second_law_form.vl.value)
        const vr = parseInt(second_law_form.vr.value)
        
        const rects = second_law_rects(gap_size)
        const bodies = second_law_bodies(n, r, vl, vr, rects)
        simulation.reset(bodies, rects)
        pause_btn.disabled = true
        play_btn.disabled = false
        step_btn.disabled = false
    }
    second_law_btn.addEventListener('click', submit_second_law_form)
    second_law_form.number.addEventListener('change', submit_second_law_form)
    second_law_form.gap_size.addEventListener('change', submit_second_law_form)
    second_law_form.radius.addEventListener('change', submit_second_law_form)
    second_law_form.vl.addEventListener('change', submit_second_law_form)
    second_law_form.vr.addEventListener('change', submit_second_law_form)
    second_law_container.addEventListener('mouseover', () => {
        second_law_form.style.display = 'block'
    })
    second_law_container.addEventListener('mouseout', () => {
        second_law_form.style.display = 'none'
    })

    draw_loop(simulation)
}

function draw_loop(simulation: Simulation) {
    simulation.draw_all()
    window.requestAnimationFrame(() => draw_loop(simulation))
}

main()