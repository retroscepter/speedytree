import { Superset } from '../deps.ts'

import type { Point } from './shapes/point.ts'
import type { Rect } from './shapes/rect.ts'

export interface QuadtreeOpts {
    maxDepth: number
    maxPointsPerNode: number
    removeEmptyNodes: boolean
}

export const defaultQuadtreeOpts: QuadtreeOpts = {
    maxDepth: -1,
    maxPointsPerNode: 4,
    removeEmptyNodes: false
}

export class Quadtree<CustomPoint = Point> {
    public opts: QuadtreeOpts

    private points: Superset<CustomPoint> = new Superset()
    private nodes: Superset<Quadtree<CustomPoint>> = new Superset()

    constructor(public bounds: Rect, opts?: Partial<QuadtreeOpts>) {
        this.opts = Object.assign({}, defaultQuadtreeOpts, opts)
    }
}
