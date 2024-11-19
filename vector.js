export class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    toString() {
        return `${this.x.toExponential(2)}, ${this.y.toExponential(2)}`
    }
}

export function scale(scalar, vec) {
    return new Vector(scalar * vec.x, scalar * vec.y)
}

export function add(vec1, vec2) {
    return new Vector(vec1.x + vec2.x, vec1.y + vec2.y)
}

export function sub(vec1, vec2) {
    return add(vec1, scale(-1, vec2))
}

export function norm(vec) {
    return Math.hypot(vec.x, vec.y)
}

export function dist(vec1, vec2) {
    return norm(sub(vec1, vec2))
}
