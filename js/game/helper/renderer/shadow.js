import {get_image} from "../fileReader.js";
import Game from "../../model/Game.js";


export default function renderShadow({ position, sizeMultiplier }){
    const ctx = Game.getInstance().canvasCtx;
    get_image('other', 'shadow', null, (img) => {
        ctx.drawImage(img, position.x, position.y, img.width * sizeMultiplier, img.height * sizeMultiplier);
    });
}
