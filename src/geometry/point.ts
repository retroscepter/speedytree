export class Point<CustomData = any> {
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly data?: CustomData
    ) {}
}
