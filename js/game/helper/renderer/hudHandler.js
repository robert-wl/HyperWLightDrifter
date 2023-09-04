import {get_image} from "../fileReader.js";
import Game from "../../model/Game.js";


export default function hudHandler({ HUD, player }){
    HUD.clearRect(0, 0, HUD.canvas.width, HUD.canvas.height)

    HUD.fillStyle = 'rgb(100, 100, 100)';
    HUD.fillRect(2, 30, 15, 4);
    HUD.fillStyle = 'lightgreen';
    HUD.fillRect(2, 30, ((player.healthPack % 4) / 3) * 15, 4);

    HUD.fillStyle = 'rgb(100, 100, 100)';
    HUD.fillRect(2, 4, 130, 2);
    HUD.fillStyle = 'white';
    HUD.fillRect(2, 4, ((player.stamina % 101) / 10) * 13, 2);

    HUD.fillStyle = 'rgb(100, 100, 100)';
    HUD.fillRect(24, 30, 15, 4);
    HUD.fillStyle = 'white';
    HUD.fillRect(24, 30, ((player.bombs % 3) / 2) * 15, 4);

    const width = [0, 15, 27, 42, 57, 72]

    HUD.fillStyle = 'rgb(100, 100, 100)';
    HUD.fillRect(45, 12, 86, 10);
    for(let i = 0; i < player.maxhealth; i++){
        if(i < player.health){
            HUD.fillStyle = 'lightgreen';
            HUD.fillRect(45 + width[i], 12, 15, 10);
        }
    }

    HUD.fillStyle = 'rgb(100, 100, 100)';
    HUD.fillRect(45, 25, 86, 10);
    HUD.fillStyle = 'rgb(250, 75, 75)';
    HUD.fillRect(45, 25, ((player.bullets % 4) / 3) * 87, 10);

    get_image('UI', 'HUD', null, function (img) {
        Game.getInstance().HUD.drawImage(img, 0, 0, img.width * 1.5, img.height * 1.5);
    })
}
