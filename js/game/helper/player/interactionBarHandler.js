import Game from "../../model/Game/Game.js";
import {get_image} from "../fileReader.js";
import {getNumberedImage} from "../imageLoader.js";
import {drawImage} from "../renderer/drawer.js";
import GameSettings from "../../constants.js";

let animationStage = 1;
let number = 0;
export default function interactionBarHandler({ medkit, opacity }){
    const { player, ctx, keys } = Game.getInstance();


    if(keys.includes("e") && opacity >= 0.5){
        number += 1;

        medkit.interactionStage++;

        if(medkit.interactionStage === 20){
            player.healing = 6;
            return true;
        }

        if(number % 10 === 0){
            animationStage = (animationStage % 3) + 2;
        }

        const interactionBar = getNumberedImage('interaction_bar', animationStage);

        drawImage({
            img: interactionBar,
            x: player.position.x + 50,
            y: player.position.y - 10,
            width: interactionBar.width * GameSettings.GAME.GAME_SCALE,
            height: interactionBar.height * GameSettings.GAME.GAME_SCALE,
        });
    }
    else {
        if(medkit.interactionStage > 0) {
            medkit.interactionStage -= 1;
        }

        Game.getInstance().setTransparency(opacity);

        const interactionBar = getNumberedImage('interaction_bar', 1);

        drawImage({
            img: interactionBar,
            x: player.position.x + 50,
            y: player.position.y - 10,
            width: interactionBar.width * GameSettings.GAME.GAME_SCALE,
            height: interactionBar.height * GameSettings.GAME.GAME_SCALE,
        });
    }

    ctx.fillStyle = "rgb(255, 255, 255, 0.9)";

    ctx.fillRect(
        player.position.x + 54,
        player.position.y - 2,
        medkit.interactionStage,
        16,
    );

    Game.getInstance().setTransparency(1);

    return false;
}
