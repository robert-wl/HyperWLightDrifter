import DrawHelper from '../../model/utility/helper/DrawHelper.js';
import AssetManager from '../../model/utility/manager/AssetManager.js';
import { Box } from '../../model/utility/interfaces/Box.js';

export default function renderShadow({ position, sizeMultiplier }) {
    const shadow = AssetManager.getImage('shadow');

    const imageSize = Box.parse({
        x: position.x,
        y: position.y,
        w: shadow.width * sizeMultiplier,
        h: shadow.height * sizeMultiplier,
    });

    DrawHelper.drawImage(shadow, imageSize, true);
}
