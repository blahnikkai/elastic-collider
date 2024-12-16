import {Body} from './body.js'
import {Vector, dist, norm} from './vector.js'

let playing = false

function step_all(ctx: CanvasRenderingContext2D, bodies: Body[]): void {
    ctx.clearRect(0, 0, 500, 500)
    for(let i = 0; i < bodies.length; i++) {
        for(let j = i + 1; j < bodies.length; j++) {
            bodies[i].check_other_collide(bodies[j])
        }
    }
    for(const body of bodies) {
        body.step()
    }
    draw_all(ctx, bodies)
    if(playing) {
        window.requestAnimationFrame(() => step_all(ctx, bodies))
    }
}

function draw_all(ctx: CanvasRenderingContext2D, bodies: Body[]): void {
    for(const body of bodies) {
        body.draw(ctx)
    }
    const energy = calc_energy(bodies)
    ctx.fillStyle = 'black'
    ctx.fillText(energy.toString(), 20, 20)
}

function check_collides_existing(bodies: Body[], x: number, y: number, r: number): boolean {
    for(const body of bodies) {
        if(dist(new Vector(x, y), body.pos) < body.r + r) {
            return true
        }
    }
    return false
}

function randomBodies(n: number, v: number, r: number): Body[] {
    let bodies = []
    bodies.push(new Body(100, new Vector(250, 250), new Vector(0, 0), 30, 'red'))
    for(let i = 0; i < n; i++) {
        while(true) {
            const x = (500 - 2 * r) * Math.random() + r;
            const y = (500 - 2 * r) * Math.random() + r;
            if(!check_collides_existing(bodies, x, y, r)) {
                let color = 'black'
                if(i < 20) {
                    color = 'red'
                }
                bodies.push(new Body(1, new Vector(x, y), new Vector(v, v), r, color))
                break
            }
        }
    }
    return bodies
}

function calc_energy(bodies: Body[]): number {
    let energy = 0
    for(const body of bodies) {
        energy += .5 * body.mass * Math.pow(norm(body.vel), 2)
    }
    return energy
}

function main() {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    let bodies = randomBodies(300, 20, 3)

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
    
    draw_all(ctx, bodies)

    const step_btn = document.getElementById("step")
    step_btn.addEventListener("click", () => step_all(ctx, bodies))
    const play_btn = document.getElementById("play")
    play_btn.addEventListener("click", () => {
        playing = true
        step_all(ctx, bodies)
    })
    const pause_btn = document.getElementById("pause")
    pause_btn.addEventListener("click", () => {
        playing = false
    })
    
}

main()
