import { random_number } from "./simulation.js"
import { Body } from "./body.js"
import { norm } from './vector.js'

export enum RectangleType {
    Wall = "wall",
    Spawn = "bodies",
    Measurement = "measurement",
    Delete = "delete",
}

export class Rectangle {

    x1: number
    y1: number
    x2: number
    y2: number
    type: RectangleType
    // hsla
    color: number[]
    // tick, total energy, body count, mean energy
    energy_data: number[][]

    constructor(x1: number, y1: number, x2: number, y2: number, type: RectangleType = RectangleType.Wall, hue: number | null = null) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.type = type
        this.energy_data = [[], [], [], []]
        switch(type) {
            case RectangleType.Wall:
                this.color = [0, 0, 0, 1]
                break
            case RectangleType.Spawn:
                if(hue == null) {
                    this.color = [0, 0, 0, 0.4]
                }
                else {
                    this.color = [hue, 100, 40, 0.4]
                }
                break
            case RectangleType.Measurement:
                if(hue == null) {
                    throw new Error('hue should be specified for measurement')
                }
                this.color = [hue, 80, 80, 0.25]
                break
            case RectangleType.Delete:
                this.color = [0, 100, 40, 0.7]
                break
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath()
        ctx.moveTo(this.x1, this.y1)
        ctx.lineTo(this.x2, this.y1)
        ctx.lineTo(this.x2, this.y2)
        ctx.lineTo(this.x1, this.y2)
        ctx.lineTo(this.x1, this.y1)
        ctx.stroke()
        ctx.fillStyle = `hsla(${this.color[0]}, ${this.color[1]}%, ${this.color[2]}%, ${this.color[3]})`
        ctx.fill()
        ctx.closePath()
    }

    intersect(x: number, y: number, r: number): boolean {
        return this.x1 - r < x && x < this.x2 + r && this.y1 - r < y && y < this.y2 + r
    }

    calc_energy(bodies: Body[], tick: number): number[] {
        let energy = 0
        let cnt = 0
        for(const body of bodies) {
            if(this.x1 < body.pos.x && body.pos.x < this.x2 && this.y1 < body.pos.y && body.pos.y < this.y2) {
                energy += .5 * body.mass * Math.pow(norm(body.vel), 2)
                cnt += 1
            }
        }
        if(tick % 10 == 0 && tick != this.energy_data[0][this.energy_data[0].length - 1]) {
            this.energy_data[0].push(tick)
            this.energy_data[1].push(energy)
            this.energy_data[2].push(cnt)
            this.energy_data[3].push(energy / cnt)
        }
        return [energy, cnt]
    }
}