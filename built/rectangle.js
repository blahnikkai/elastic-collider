export var RectangleType;
(function (RectangleType) {
    RectangleType["Wall"] = "wall";
    RectangleType["Spawn"] = "bodies";
    RectangleType["Measurement"] = "measurement";
})(RectangleType || (RectangleType = {}));
export class Rectangle {
    constructor(x1, y1, x2, y2, type = RectangleType.Wall) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.type = type;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineTo(this.x1, this.y2);
        ctx.lineTo(this.x1, this.y1);
        ctx.stroke();
        switch (this.type) {
            case RectangleType.Wall:
                ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
                break;
            case RectangleType.Spawn:
                ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
                break;
            case RectangleType.Measurement:
                ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
                break;
        }
        ctx.fill();
        ctx.closePath();
    }
    intersect(x, y, r) {
        return this.x1 - r < x && x < this.x2 + r && this.y1 - r < y && y < this.y2 + r;
    }
}
