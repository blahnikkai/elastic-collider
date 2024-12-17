export class Rectangle {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineTo(this.x1, this.y2);
        ctx.lineTo(this.x1, this.y1);
        ctx.closePath();
        ctx.stroke();
        // this.ctx.fill()
    }
    intersect(x, y, r) {
        return this.x1 - r < x && x < this.x2 + r && this.y1 - r < y && y < this.y2 + r;
    }
}
