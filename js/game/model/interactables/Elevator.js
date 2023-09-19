import {getImage} from "../../helper/imageLoader.js";
import {drawImage} from "../../helper/renderer/drawer.js";
import Game from "../Game/Game.js";
import GameSettings from "../../constants.js";
import InteractionBar from "./InteractionBar.js";


export default class Elevator {sd
    static generate({ x, y}) {
        Game.getInstance().elevator = new Elevator({x, y});
    }
    constructor({ x, y }) {
        this.x = x;
        this.y = y;
        this.width = 0;
        this.height = 0;
        this.interactionStage = 0;
        this.activated = false;
        this.acceleration = 0;
    }

    update() {

        this.render();
        if(this.activated) {
            this.move();
            return;
        }
        this.detectInteraction();
    }

    detectInteraction(){
        InteractionBar.detectPlayerInteraction(this, 50);
    }

    render() {
        const elevator = getImage('elevator');

        this.width = -0.5 * elevator.width;
        this.height = -2 * elevator.height;


        drawImage({
            img: elevator,
            x: this.x - elevator.width,
            y: this.y - elevator.height,
            width: elevator.width * GameSettings.GAME.GAME_SCALE,
            height: elevator.height * GameSettings.GAME.GAME_SCALE,
        })
    }

    activate() {
        this.activated = true;

        const { player } = Game.getInstance();
        player.switchState(player.inElevatorState);
    }

    goToNextStage() {
        this.y = 0;
    }

    move() {
        const { player } = Game.getInstance();
        this.acceleration += 0.1;

        if(this.acceleration > 2) {
            this.acceleration = 2;
        }
        this.y += this.acceleration;
        player.position.y += this.acceleration;
        player.centerPosition.y += this.acceleration;
    }
}
