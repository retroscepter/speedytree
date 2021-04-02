import {
    assertEquals,
    assertArrayIncludes
} from 'https://deno.land/std@0.91.0/testing/asserts.ts'

import { QuadTree, Rect, Point } from '../mod.ts'

const WIDTH = 1000
const HEIGHT = 1000
const INSERT_COUNT = 1000

function randomPoint(range: Rect): Point {
    const x = -(range.width / 2) + Math.floor(Math.random() * range.width)
    const y = -(range.height / 2) + Math.floor(Math.random() * range.height)
    return new Point(x, y)
}

Deno.test('insert points', () => {
    const points: Point[] = []
    const bounds = new Rect(0, 0, WIDTH, HEIGHT)
    const quadtree = new QuadTree(bounds)

    for (let i = 0; i < INSERT_COUNT; i++) {
        const point = randomPoint(bounds)
        quadtree.insert(point)
        points.push(point)
    }

    const allPoints = quadtree.getPoints()

    assertEquals(points.length, allPoints.length)

    for (const point of points) {
        assertArrayIncludes(allPoints, [point])
    }
})

Deno.test('insert return value', () => {
    const quadtree = new QuadTree(new Rect(0, 0, WIDTH, HEIGHT))
    const point1 = new Point(0, 0)
    const point2 = new Point(WIDTH * 2, HEIGHT * 2)
    assertEquals(quadtree.insert(point1), true)
    assertEquals(quadtree.insert(point2), false)
})

Deno.test('insert point out of range', () => {
    const quadtree = new QuadTree(new Rect(0, 0, WIDTH, HEIGHT))
    const point = new Point(WIDTH * 2, HEIGHT * 2)
    assertEquals(quadtree.insert(point), false)
    assertEquals(quadtree.getPoints().indexOf(point), -1)
})

Deno.test('insert with max depth', () => {
    const bounds = new Rect(0, 0, WIDTH, HEIGHT)
    const quadtree = new QuadTree(bounds, { maxDepth: 1 })

    for (let i = 0; i < INSERT_COUNT; i++) {
        quadtree.insert(randomPoint(bounds))
    }

    const tree = quadtree.getTree()

    assertEquals(tree.divided && tree.nodes.every(n => !n.divided), true)
})

Deno.test('query rect', () => {
    const width = 500 + Math.floor(Math.random() * 500)
    const height = 500 + Math.floor(Math.random() * 500)
    const bounds = new Rect(0, 0, WIDTH, HEIGHT)
    const quadtree = new QuadTree(bounds)

    const queryX = -(width / 2) + Math.floor(Math.random() * width)
    const queryY = -(height / 2) + Math.floor(Math.random() * height)
    const queryWidth = Math.floor(Math.random() * width)
    const queryHeight = Math.floor(Math.random() * height)
    const queryBounds = new Rect(queryX, queryY, queryWidth, queryHeight)

    const pointsInside: Point[] = []
    const pointsOutside: Point[] = []

    for (let i = 0; i < INSERT_COUNT; i++) {
        const point = randomPoint(queryBounds)

        if (queryBounds.contains(point)) {
            pointsInside.push(point)
        } else {
            pointsOutside.push(point)
        }

        assertEquals(quadtree.insert(point), true)
    }

    const results = quadtree.query(queryBounds)

    assertEquals(results.length, pointsInside.length)
    assertArrayIncludes(results, pointsInside)
})

Deno.test('remove points', () => {
    const bounds = new Rect(0, 0, WIDTH, HEIGHT)
    const quadtree = new QuadTree(bounds, { removeEmptyNodes: true })

    const points: Point[] = []
    const pointsInside: Point[] = []
    const pointsOutside: Point[] = []

    for (let i = 0; i < INSERT_COUNT; i++) {
        const point = randomPoint(bounds)

        if (bounds.contains(point)) {
            pointsInside.push(point)
        } else {
            pointsOutside.push(point)
        }

        quadtree.insert(point)
        points.push(point)
    }

    for (const point of points) {
        assertEquals(quadtree.remove(point), pointsInside.indexOf(point) !== -1)
    }

    assertEquals(quadtree.getTree().divided, false)
})

Deno.test('export tree', () => {
    const bounds = new Rect(0, 0, WIDTH, HEIGHT)
    const quadtree = new QuadTree(bounds)

    for (let i = 0; i < INSERT_COUNT; i++) {
        quadtree.insert(randomPoint(bounds))
    }

    assertEquals(quadtree.getTree().divided, true)
})
