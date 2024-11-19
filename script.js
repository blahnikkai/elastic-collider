class Body {

    constructor(mass, pos, vel) {
        this.mass = mass;
        this.pos = pos
        this.vel = vel
        this.r = 15
    }

    step() {
        this.pos = add(this.pos, scale(.1, this.vel))
        this.check_wall_collide()
    }

    check_wall_collide() {
        if(this.pos.x - this.r < 0) {
            this.vel.x *= -1;
        }
        if(this.pos.x + this.r > 500) {
            this.vel.x *= -1;
        }
        if(this.pos.y - this.r < 0) {
            this.vel.y *= -1;
        }
        if(this.pos.y + this.r > 500) {
            this.vel.y *= -1;
        }
    }

    check_other_collide(other) {
        if(dist(this.pos, other.pos) > this.r + other.r) {
            return;
        }
        const pos_diff = sub(this.pos, other.pos)
        console.log(pos_diff)
        const angle = Math.tan(pos_diff.y, pos_diff.x) * 180 / Math.PI
        console.log(angle)
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        ctx.stroke()
    }
}

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    toString() {
        return `${this.x.toExponential(2)}, ${this.y.toExponential(2)}`
    }
}

function scale(scalar, vec) {
    return new Vector(scalar * vec.x, scalar * vec.y)
}

function add(vec1, vec2) {
    return new Vector(vec1.x + vec2.x, vec1.y + vec2.y)
}

function sub(vec1, vec2) {
    return add(vec1, scale(-1, vec2))
}

function norm(vec) {
    return Math.hypot(vec.x, vec.y)
}

function dist(vec1, vec2) {
    return norm(sub(vec1, vec2))
}

function draw_all(ctx, bodies) {
    ctx.clearRect(0, 0, 500, 500)
    for(let i = 0; i < bodies.length; i++) {
        for(let j = i + 1; j < bodies.length; j++) {
            bodies[i].check_other_collide(bodies[j])
        }
    }
    for(const body of bodies) {
        body.step()
        body.draw(ctx)
    }
    window.requestAnimationFrame(() => draw_all(ctx, bodies))
}

function main() {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    let bodies = []
    bodies.push(new Body(10, new Vector(300, 250), new Vector(-40, 12)))
    bodies.push(new Body(10, new Vector(200, 235), new Vector(10, 30)))
    bodies.push(new Body(10, new Vector(400, 20), new Vector(85, -70)))
    
    draw_all(ctx, bodies)

    const step_btn = document.getElementById("")
    
}

main()
