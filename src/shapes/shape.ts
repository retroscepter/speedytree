import type { Point } from './point.ts'
import type { Rect } from './rect.ts'

export interface Shape extends Point {
    contains(point: Point): boolean
    intersects(range: Rect): boolean
}
