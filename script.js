let playing = false

class Body {

    constructor(mass, pos, vel, r) {
        this.mass = mass;
        this.pos = pos
        this.vel = vel
        this.r = r
    }

    step() {
        this.pos = add(this.pos, scale(.1, this.vel))
        this.check_wall_collide()
    }

    check_wall_collide() {
        if(this.pos.x - this.r < 0 && this.vel.x < 0) {
            this.pos.x = this.r
            this.vel.x *= -1;
        }
        if(this.pos.x + this.r > 500 && this.vel.x > 0) {
            this.pos.x = 500 - this.r
            this.vel.x *= -1;
        }
        if(this.pos.y - this.r < 0 && this.vel.y < 0) {
            this.vel.y *= -1;
        }
        if(this.pos.y + this.r > 500 && this.vel.y > 0) {
            this.vel.y *= -1;
        }
    }

    calc_post_collision_vel(other) {
        const pos_diff = sub(this.pos, other.pos)
        const pos_diff_norm = norm(pos_diff)
        const vel_diff = sub(this.vel, other.vel)
        const mass_factor = 2 * other.mass / (this.mass + other.mass)
        const vel_change = scale(mass_factor * dot(vel_diff, pos_diff) / (pos_diff_norm * pos_diff_norm), pos_diff)
        return sub(this.vel, vel_change)
    }

    check_other_collide(other) {
        if(dist(this.pos, other.pos) >= this.r + other.r) {
            return;
        }
        const pos_diff = sub(this.pos, other.pos)
        const vel_diff = sub(this.vel, other.vel)
        if(dot(vel_diff, pos_diff) >= 0) {
            return;
        }
        const vel1 = this.calc_post_collision_vel(other)
        const vel2 = other.calc_post_collision_vel(this)
        this.vel = vel1
        other.vel = vel2
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()
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

function dot(vec1, vec2) {
    return vec1.x * vec2.x + vec1.y * vec2.y
}

function step_all(ctx, bodies) {
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

function draw_all(ctx, bodies) {
    for(const body of bodies) {
        body.draw(ctx)
    }
}

function check_collides_existing(bodies, x, y, r) {
    for(const body of bodies) {
        if(dist(new Vector(x, y), body.pos) < body.r + r) {
            return true
        }
    }
    return false
}

function randomBodies(n, v, r) {
    let bodies = []
    bodies.push(new Body(100, new Vector(250, 250), new Vector(0, 0), 30))
    for(let i = 0; i < n; i++) {
        while(true) {
            const x = (200 - 2 * r) * Math.random() + r;
            const y = (200 - 2 * r) * Math.random() + r;
            if(!check_collides_existing(bodies, x, y, r)) {
                bodies.push(new Body(1, new Vector(x, y), new Vector(v, v), r))
                break
            }
        }
    }
    return bodies
}

function main() {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    
    let bodies = randomBodies(300, 10, 3)

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
