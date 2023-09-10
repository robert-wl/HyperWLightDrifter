import Game from "../Game/Game.js";
import {get_image} from "../../helper/fileReader.js";

let animationStage = 1;
let number = 0;
export default function handleInteractionBar({ medkit, opacity }){
    const player = Game.getInstance().player;
    const ctx = Game.getInstance().ctx;


    if(Game.getInstance().keys.includes("e") && opacity >= 0.5){
        number++;

        medkit.interactionStage++;

        if(medkit.interactionStage === 20){
            player.healing = 6;
            return true;
        }

        if(number % 10 === 0){
            animationStage = (animationStage % 3) + 2;
        }
        get_image("UI/interaction_bar", "interaction_bar", animationStage, (image) => {
            ctx.drawImage(image, player.position.x + 50, player.position.y - 10, image.width * 2, image.height * 2);
        });
    }
    else {
        if(medkit.interactionStage > 0) {
            medkit.interactionStage--;
        }
        ctx.globalAlpha = opacity;
        get_image("UI/interaction_bar", "interaction_bar", 1, (image) => {
            ctx.drawImage(image, player.position.x + 50, player.position.y - 10, image.width * 2, image.height * 2);
        });
    }

    ctx.fillStyle = "rgb(255, 255, 255, 0.9)";
    ctx.fillRect(
        player.position.x + 54,
        player.position.y - 2,
        medkit.interactionStage,
        16,
    );

    ctx.globalAlpha = 1;

    return false;
}
