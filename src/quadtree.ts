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

export class QuadTree<CustomData = any> {
    public opts: QuadtreeOpts

    private points: Superset<Point<CustomData>> = new Superset()
    private nodes: Superset<QuadTree<Point<CustomData>>> = new Superset()

    constructor(public bounds: Rect, opts?: Partial<QuadtreeOpts>) {
        this.opts = { ...defaultQuadtreeOpts, ...opts }
    }

    private get divided(): boolean {
        return this.nodes.size > 0
    }

    private get contains(): Rect['contains'] {
        return this.bounds.contains
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

        this.insert(...this.points.array().slice())

        this.points.clear()
    }

    public insert(...points: Point<CustomData>[]): boolean {
        let returnValue = false

        for (const point of points) {
            if (this.insertRecursive(point)) returnValue = true
        }

        return returnValue
    }

    public remove(...points: Point<CustomData>[]): boolean {
        let returnValue = false

        for (const point of points) {
            if (this.removeRecursive(point)) returnValue = true
        }

        return returnValue
    }

    private insertRecursive(point: Point): boolean {
        if (!this.contains(point)) return false

        const pointCount = this.points.size
        const maxPointCount = this.opts.maxPointsPerNode
        const maxDepth = this.opts.maxDepth

        if (this.divided) {
            if (pointCount < maxPointCount || maxDepth === 0) {
                this.points.add(point)
            } else if (maxDepth === -1 || maxDepth > 0) {
                this.divide()
            }
        }

        if (this.divided) {
            for (const node of this.nodes) {
                if (node.insertRecursive(point)) return true
            }
        }

        return false
    }

    private removeRecursive(point: Point): boolean {
        if (!this.contains(point)) return false

        if (!this.divided) {
            for (const p of this.points) {
                if (testPointEquality(point, p)) {
                    this.points.delete(p)
                    return true
                }
            }

            return false
        }

        let returnValue = false

        for (const node of this.nodes) {
            if (node.removeRecursive(point)) returnValue = true
        }

        if (this.opts.removeEmptyNodes) {
            if (this.nodes.every(n => n.points.size === 0 && !n.divided)) {
                this.nodes.clear()
            }
        }

        return returnValue
    }
}

function testPointEquality(a: Point, b: Point) {
    return a.x === b.x && a.y === b.y
}
