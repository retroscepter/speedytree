import { assertEquals } from 'https://deno.land/std@0.91.0/testing/asserts.ts'

import { Rect, Circle, Point } from '../mod.ts'

Deno.test('rect contains point', () => {
    const rect = new Rect(0, 0, 200, 200)
    const point1 = new Point(0, 0)
    const point2 = new Point(100, 100)
    const point3 = new Point(300, 300)
    assertEquals(rect.contains(point1), true)
    assertEquals(rect.contains(point2), true)
    assertEquals(rect.contains(point3), false)
})

Deno.test('circle contains point', () => {
    const circle = new Circle(0, 0, 100)
    const point1 = new Point(0, 0)
    const point2 = new Point(50, 50)
    const point3 = new Point(90, 90)
    const point4 = new Point(100, 100)
    assertEquals(circle.contains(point1), true)
    assertEquals(circle.contains(point2), true)
    assertEquals(circle.contains(point3), false)
    assertEquals(circle.contains(point4), false)
})
