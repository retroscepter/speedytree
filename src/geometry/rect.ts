import type { Shape } from './shape.ts'
import type { Point } from './point.ts'

export class Rect implements Shape {
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly width: number,
        public readonly height: number
    ) {}

    get top(): number {
        return this.y - this.height / 2
    }

    get bottom(): number {
        return this.y + this.height / 2
    }

    get left(): number {
        return this.x - this.width / 2
    }

    get right(): number {
        return this.x + this.width / 2
    }

    contains(point: Point): boolean {
        return (
            point.x >= this.left &&
            point.x <= this.right &&
            point.y >= this.top &&
            point.y <= this.bottom
        )
    }

    intersects(range: Rect): boolean {
        return !(
            range.left > this.right ||
            range.right < this.left ||
            range.top > this.bottom ||
            range.bottom < this.top
        )
    }
}
