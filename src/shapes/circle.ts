import type { Shape } from './shape.ts'
import type { Point } from './point.ts'
import type { Rect } from './rect.ts'

export class Circle implements Shape {
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly radius: number
    ) {}

    contains(point: Point): boolean {
        const xDiff = point.x - this.x
        const yDiff = point.y - this.y
        return xDiff * xDiff + yDiff * yDiff <= this.radius * this.radius
    }

    intersects(range: Rect): boolean {
        const xDiff = Math.abs(range.x - this.x)
        const yDiff = Math.abs(range.y - this.y)

        if (xDiff > range.width / 2 + this.radius) return false
        if (yDiff > range.height / 2 + this.radius) return false
        if (xDiff <= range.width / 2) return true
        if (yDiff <= range.height / 2) return true

        const cX = xDiff - range.width / 2
        const cY = yDiff - range.height / 2
        const cornerDist = cX * cX + cY * cY

        return cornerDist <= this.radius * this.radius
    }
}
