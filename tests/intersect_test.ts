import { assertEquals } from 'https://deno.land/std@0.91.0/testing/asserts.ts'

import { Rect, Circle } from '../mod.ts'

Deno.test('rect intersects rect', () => {
    const rect1 = new Rect(0, 0, 200, 200)
    const rect2 = new Rect(100, 100, 200, 200)
    const rect3 = new Rect(300, 300, 200, 200)
    const rect4 = new Rect(600, 600, 200, 200)
    assertEquals(rect1.intersects(rect2), true)
    assertEquals(rect1.intersects(rect3), false)
    assertEquals(rect1.intersects(rect4), false)
    assertEquals(rect2.intersects(rect1), true)
    assertEquals(rect2.intersects(rect3), true)
    assertEquals(rect2.intersects(rect4), false)
    assertEquals(rect3.intersects(rect1), false)
    assertEquals(rect3.intersects(rect2), true)
    assertEquals(rect3.intersects(rect4), false)
    assertEquals(rect4.intersects(rect1), false)
    assertEquals(rect4.intersects(rect2), false)
    assertEquals(rect4.intersects(rect3), false)
})

Deno.test('rect intersects circle', () => {
    const rect = new Rect(0, 0, 200, 200)
    const circle1 = new Circle(100, 100, 100)
    const circle2 = new Circle(150, 150, 100)
    const circle3 = new Circle(200, 200, 100)
    const circle4 = new Circle(400, 400, 100)
    assertEquals(circle1.intersects(rect), true)
    assertEquals(circle2.intersects(rect), true)
    assertEquals(circle3.intersects(rect), false)
    assertEquals(circle4.intersects(rect), false)
})
