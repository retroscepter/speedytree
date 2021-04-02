import { Superset } from '../deps.ts'

import type { Point } from './shapes/point.ts'
import { Rect } from './shapes/rect.ts'

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

export class QuadTree<CustomPoint = Point> {
    public opts: QuadtreeOpts

    private points: Superset<CustomPoint> = new Superset()
    private nodes: Superset<QuadTree<CustomPoint>> = new Superset()

    constructor(public bounds: Rect, opts?: Partial<QuadtreeOpts>) {
        this.opts = { ...defaultQuadtreeOpts, ...opts }
    }

    private get divided(): boolean {
        return this.nodes.size > 0
    }

    private divide(): void {
        const maxDepth = this.opts.maxDepth
        const childMaxDepth = maxDepth === -1 ? -1 : maxDepth - 1
        const childOpts = { ...this.opts, maxDepth: childMaxDepth }

        const x = this.bounds.x
        const y = this.bounds.y
        const width = this.bounds.width / 2
        const height = this.bounds.height / 2

        const ne = new Rect(x + width, y, width, height)
        const nw = new Rect(x, y, width, height)
        const se = new Rect(x + width, y + height, width, height)
        const sw = new Rect(x, y + height, width, height)

        this.nodes
            .add(new QuadTree(ne, childOpts))
            .add(new QuadTree(nw, childOpts))
            .add(new QuadTree(se, childOpts))
            .add(new QuadTree(sw, childOpts))

        // this.insert(...this.points.array().slice())

        this.points.clear()
    }
}
