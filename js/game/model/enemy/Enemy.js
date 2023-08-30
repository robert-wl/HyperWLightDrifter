import Game from "../Game.js";

export default class Enemy {
    constructor({ x, y, w, h, health }) {
        this.position = {
            x: x,
            y: y,
        };
        this.health = health;
        this.width = w;
        this.height = h;
        this.image = null;
    }
    update() {
        this.render();
    }
    render() {

    }
}
