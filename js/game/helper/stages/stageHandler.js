import Collideable from '../../model/collideable/Collideable.js';
import Medkit from '../../model/interactables/Medkit.js';
import Game from '../../model/Game/Game.js';
import Judgement from '../../model/enemy/judgement/Judgement.js';
import {getImage, imageLoader} from "../imageLoader.js";
import GameSettings from "../../constants.js";
import Door from "../../model/interactables/Door.JS";

export async function firstStage() {
    await imageLoader(GameSettings.IMAGES.STAGE_ONE);

    const mapGround = getImage('map_ground');
    const mapTop = getImage('map_top');
    Game.getInstance().camera.init({
        lowerBackground: mapGround,
        topBackground: mapTop,
    })
    Game.getInstance().player.position.x = 900;
    Game.getInstance().player.position.y = 500;
    Game.getInstance().player.centerPosition.x = 900;
    Game.getInstance().player.centerPosition.y = 500;

    Door.generate({
        x: 904,
        y: 1040,
        collideable: true,
    })

    // x: 958,
    //     y: 1100,
    // CrystalBrute.generate({
    //     x: 900,
    //     y: 500,
    // });
    const colliders = [
        { x: 100, y: 0, w: 300, h: 1000 },
        { x: 400, y: 0, w: 1025, h: 300 },
        { x: 1425, y: 0, w: 300, h: 1000 },
        { x: 100, y: 1050, w: 800, h: 500 },
        { x: 1000, y: 1050, w: 800, h: 500 },
        { x: 100, y: 1550, w: 530, h: 800 },
        { x: 1250, y: 1550, w: 530, h: 800 },
        { x: 630, y: 2150, w: 620, h: 800 },
    ];

    for (const collider of colliders) {
        Collideable.generate(collider);
    }

    const medkits = [
        { x: 1400, y: 300 },
        { x: 1400, y: 800 },
        { x: 400, y: 500 },
    ];

    for (const medkit of medkits) {
        Medkit.generate(medkit);
    }
}

export async function secondStage({ game }) {
    await imageLoader(GameSettings.IMAGES.STAGE_TWO);

    const mapGround = getImage('map_ground');

    Game.getInstance().camera.init({
        lowerBackground: mapGround,
        topBackground: null,
    })
    console.log(mapGround)
    // Game.getInstance().camera.lowerBackground = mapGround;
    // Game.getInstance().camera.topBackground = null;
    game.player.position.x = 900;
    game.player.position.y = 400;
    game.player.centerPosition.x = 900 + game.player.width / 2;
    game.player.centerPosition.y = 400 + game.player.height / 2;

    Judgement.generate({ x: 900, y: 400, collideable: true });

    const colliders = [
        { x: 100, y: 0, w: 300, h: 1000 },
        { x: 400, y: 0, w: 1025, h: 300 },
        { x: 1425, y: 0, w: 300, h: 1000 },
        { x: 100, y: 1050, w: 800, h: 500 },
        { x: 1000, y: 1050, w: 800, h: 500 },
        { x: 100, y: 1550, w: 530, h: 800 },
        { x: 1250, y: 1550, w: 530, h: 800 },
        { x: 630, y: 2150, w: 620, h: 800 },
    ];
    // for (const collider of colliders) {
    //     Collideable.generate(collider);
    // }

    const medkits = [
        { x: 1400, y: 300 },
        { x: 1400, y: 800 },
        { x: 400, y: 500 },
    ];

    for (const medkit of medkits) {
        Medkit.generate(medkit);
    }
}
