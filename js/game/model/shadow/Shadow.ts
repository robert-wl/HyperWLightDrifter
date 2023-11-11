import { Vector } from '../utility/interfaces/Vector.js';
import AssetManager from '../utility/manager/AssetManager.js';
import { Box } from '../utility/interfaces/Box.js';
import DrawHelper from '../utility/helper/DrawHelper.js';

export default class Shadow {
    private readonly sizeMultiplier: number;

    public constructor(sizeMultiplier: number) {
        this.sizeMultiplier = sizeMultiplier;
    }

    public renderShadow(position: Vector) {
        const shadow = AssetManager.getImage('shadow');

        const imageSize = Box.parse({
            x: position.x,
            y: position.y,
            w: shadow.width * this.sizeMultiplier,
            h: shadow.height * this.sizeMultiplier,
        });

        DrawHelper.drawImage(shadow, imageSize, true);
    }
}
