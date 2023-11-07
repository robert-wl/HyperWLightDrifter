export default class HitBoxComponent {
    private readonly xOffset: number;
    private readonly yOffset: number;
    private readonly wOffset: number;
    private readonly hOffset: number;

    public constructor(xOffset: number, yOffset: number, wOffset: number, hOffset: number) {
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.wOffset = wOffset;
        this.hOffset = hOffset;
    }

    public getPoints(position: Position, width: number, height: number) {
        return {
            x: position.x + this.xOffset,
            y: position.y + this.yOffset,
            w: width - this.wOffset,
            h: height - this.hOffset,
        };
    }
}
