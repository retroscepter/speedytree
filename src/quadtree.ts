import { Superset } from '../deps.ts'

import type { Point } from './geometry/point.ts'
import type { Shape } from './geometry/shape.ts'
import { Rect } from './geometry/rect.ts'

export interface QuadTreeOpts {
    maxDepth: number
    maxPointsPerNode: number
    removeEmptyNodes: boolean
}

export const defaultQuadtreeOpts: QuadTreeOpts = {
    maxDepth: -1,
    maxPointsPerNode: 4,
    removeEmptyNodes: false
}

export class QuadTree<CustomData = any> {
    public opts: QuadTreeOpts

    private points: Superset<Point<CustomData>> = new Superset()
    private nodes: Superset<QuadTree<Point<CustomData>>> = new Superset()

    constructor(public bounds: Rect, opts?: Partial<QuadTreeOpts>) {
        this.opts = { ...defaultQuadtreeOpts, ...opts }
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

    public query(range: Shape): Point<CustomData>[] {
        return this.queryRecursive(range)
    }

    private insertRecursive(point: Point): boolean {
        if (!this.bounds.contains(point)) return false

        const pointCount = this.points.size
        const maxPointCount = this.opts.maxPointsPerNode
        const maxDepth = this.opts.maxDepth

        if (this.nodes.size === 0) {
            if (pointCount < maxPointCount || maxDepth === 0) {
                this.points.add(point)
            } else if (maxDepth === -1 || maxDepth > 0) {
                this.divide()
            }
        }

        if (this.nodes.size > 0) {
            for (const node of this.nodes) {
                if (node.insertRecursive(point)) return true
            }
        }

        return false
    }

    private removeRecursive(point: Point): boolean {
        if (!this.bounds.contains(point)) return false

        if (this.nodes.size === 0) {
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
            if (
                this.nodes.every(n => n.points.size === 0 && n.nodes.size === 0)
            ) {
                this.nodes.clear()
            }
        }

        return returnValue
    }

    private queryRecursive(range: Shape): Point<CustomData>[] {
        if (!range.intersects(this.bounds)) return []

        const pointsFound: Point[] = []

        if (this.nodes.size > 0) {
            for (const node of this.nodes) {
                pointsFound.push(...node.queryRecursive(range))
            }
        } else {
            for (const point of this.points) {
                if (range.contains(point)) pointsFound.push(point)
            }
        }

        return pointsFound
    }
}

function testPointEquality(a: Point, b: Point) {
    return a.x === b.x && a.y === b.y
}
