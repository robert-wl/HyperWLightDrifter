import { getImage } from '../assets/assetGetter.js';
import { drawImage } from './drawer.js';

export default function renderShadow({ position, sizeMultiplier }) {
    const shadow = getImage('shadow');

    drawImage({
        img: shadow,
        x: position.x,
        y: position.y,
        width: shadow.width * sizeMultiplier,
        height: shadow.height * sizeMultiplier,
        translate: true,
    });
}
