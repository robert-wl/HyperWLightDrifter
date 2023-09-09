import {get_image} from "../fileReader.js";
import Collideable from "../../model/collideable/Collideable.js";
import Medkit from "../../model/interactables/Medkit.js";
import Game from "../../model/Game.js";
import Judgement from "../../model/enemy/judgement/Judgement.js";


export function firstStage({ game }) {
    get_image('world', 'map_ground', null, function (img) {
        Game.getInstance().camera.lowerBackground = img;
    });
    get_image('world', 'first_map_full', null, function (img) {
        Game.getInstance().camera.topBackground = img;
    });
    game.player.position.x = 900;
    game.player.position.y = 400;

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


export function secondStage({ game }) {
    get_image('world', 'boss_room', null, function (img) {
        Game.getInstance().camera.lowerBackground = img;
    });
    Game.getInstance().camera.topBackground = null;
    game.player.position.x = 900;
    game.player.position.y = 400;

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