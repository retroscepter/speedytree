import type { Point } from './point.ts'
import type { Rect } from './rect.ts'

export interface Shape {
    x: number
    y: number
    contains(point: Point): boolean
    intersects(range: Rect): boolean
}
