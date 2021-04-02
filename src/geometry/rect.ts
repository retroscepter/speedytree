import type { Shape } from './shape.ts'
import type { Point } from './point.ts'

export class Rect implements Shape {
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly width: number,
        public readonly height: number
    ) {}

    contains(point: Point): boolean {
        return (
            point.x >= this.x &&
            point.x <= this.x + this.width &&
            point.y >= this.y &&
            point.y <= this.y + this.height
        )
    }

    intersects(range: Rect): boolean {
        return !(
            range.x > this.x + this.width ||
            range.x + range.width < this.x ||
            range.y > this.y + this.width ||
            range.y + range.width < this.y
        )
    }
}
