export class Vector {

    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    toString(): String {
        return `${this.x.toExponential(2)}, ${this.y.toExponential(2)}`
    }
}

export function scale(scalar: number, vec: Vector): Vector {
    return new Vector(scalar * vec.x, scalar * vec.y)
}

export function add(vec1: Vector, vec2: Vector): Vector {
    return new Vector(vec1.x + vec2.x, vec1.y + vec2.y)
}

export function sub(vec1: Vector, vec2: Vector): Vector {
    return add(vec1, scale(-1, vec2))
}

export function norm(vec: Vector): number {
    return Math.hypot(vec.x, vec.y)
}

export function dist(vec1: Vector, vec2: Vector): number {
    return norm(sub(vec1, vec2))
}

export function dot(vec1: Vector, vec2: Vector): number {
    return vec1.x * vec2.x + vec1.y * vec2.y
}