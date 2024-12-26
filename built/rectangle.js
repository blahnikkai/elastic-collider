import { random_number } from "./simulation.js";
export var RectangleType;
(function (RectangleType) {
    RectangleType["Wall"] = "wall";
    RectangleType["Spawn"] = "bodies";
    RectangleType["Measurement"] = "measurement";
})(RectangleType || (RectangleType = {}));
export class Rectangle {
    constructor(x1, y1, x2, y2, type = RectangleType.Wall, hue = null) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.type = type;
        switch (type) {
            case RectangleType.Wall:
                this.color = [0, 0, 0, 1];
                break;
            case RectangleType.Spawn:
                if (hue === null) {
                    hue = random_number(0, 360);
                }
                this.color = [hue, 100, 40, 0.25];
                break;
            case RectangleType.Measurement:
                if (hue === null) {
                    hue = random_number(0, 360);
                }
                this.color = [hue, 80, 80, 0.25];
                break;
        }
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineTo(this.x1, this.y2);
        ctx.lineTo(this.x1, this.y1);
        ctx.stroke();
        ctx.fillStyle = `hsla(${this.color[0]}, ${this.color[1]}%, ${this.color[2]}%, ${this.color[3]})`;
        ctx.fill();
        ctx.closePath();
    }
    intersect(x, y, r) {
        return this.x1 - r < x && x < this.x2 + r && this.y1 - r < y && y < this.y2 + r;
    }
}
