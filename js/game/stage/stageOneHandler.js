import Game from "../model/Game.js";
import Collideable from "../model/collideable/Collideable.js";


export default function stageOneHandler(){
    const game = Game.getInstance()
    Collideable.generate({
        x: 330,
        y: 860,
        w: 285,
        h: 635,
    });
    Collideable.generate({
        x: 615,
        y: 1500,
        w: 650,
        h: 200,
    });
    Collideable.generate({
        x: 1240,
        y: 860,
        w: 285,
        h: 860,
    });
    Collideable.generate({
        x: 630,
        y: 860,
        w: 210,
        h: 120,
    });
    Collideable.generate({
        x: 630,
        y: 990,
        w: 20,
        h: 20,
    });
    Collideable.generate({
        x: 1000,
        y: 860,
        w: 210,
        h: 120,
    });
    Collideable.generate({
        x: 1200,
        y: 990,
        w: 20,
        h: 20,
    });
    Collideable.generate({
        x: 980,
        y: 860,
        w: 20,
        h: 100,
    });
    Collideable.generate({
        x: 845,
        y: 860,
        w: 25,
        h: 100,
    });
    Collideable.generate({
        x: 320,
        y: 670,
        w: 40,
        h: 35,
    });
    Collideable.generate({
        x: 320,
        y: 500,
        w: 40,
        h: 35,
    });
    Collideable.generate({
        x: 320,
        y: 330,
        w: 40,
        h: 35,
    });
    Collideable.generate({
        x: 320,
        y: 330,
        w: 20,
        h: 600,
    });
    Collideable.generate({
        x: 1490,
        y: 670,
        w: 40,
        h: 35,
    });
    Collideable.generate({
        x: 1490,
        y: 500,
        w: 40,
        h: 35,
    });
    Collideable.generate({
        x: 1490,
        y: 330,
        w: 40,
        h: 35,
    });
    Collideable.generate({
        x: 1510,
        y: 330,
        w: 20,
        h: 600,
    });
    Collideable.generate({
        x: 300,
        y: 250,
        w: 423,
        h: 75,
    });
    Collideable.generate({
        x: 1125,
        y: 250,
        w: 423,
        h: 75,
    });
    Collideable.generate({
        x: 775,
        y: 250,
        w: 40,
        h: 55,
    });
    Collideable.generate({
        x: 1025,
        y: 250,
        w: 45,
        h: 55,
    });
    Collideable.generate({
        x: 705,
        y: 150,
        w: 400,
        h: 65,
    });
}
