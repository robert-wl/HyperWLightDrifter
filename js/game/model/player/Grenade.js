import Game from "../Game.js";
import {get_image} from "../../helper/fileReader.js";
import {drawRotated} from "../../helper/renderer/drawer.js";


export default class Grenade {
    static generate({ x, y, angle }) {
        const newGrenade = new Grenade({
            x,
            y,
            w: 16,
            h: 16,
            angle,
            velocity: 10
        });
        Game.getInstance().player.projectiles.push(newGrenade);
    }
    constructor({ x, y, w, h, angle, velocity }) {
        this.position = {
            x: x,
            y: y,
        }
        this.width = w;
        this.height = h;
        this.angle = angle;
        this.velocity = velocity;
        this.rotation = Math.PI * Math.random() * 7;
        this.number = 0;
        this.animationStage = 1;
    }

    update() {
        this.number++;
        this.position.x += Math.cos(this.angle) * this.velocity;
        this.position.y += Math.sin(this.angle) * this.velocity;
        this.velocity *= 0.97;

        if(this.animationStage === 1 && this.number === 50) {
            this.animationStage++;
            this.number = 0;
        }
        if(this.animationStage > 1 && this.animationStage < 11 && this.number === 2) {
            this.velocity = 0;
            this.animationStage++;
            this.number = 0;
        }
        if(this.animationStage === 11) {
            Game.getInstance().player.projectiles.splice(Game.getInstance().player.projectiles.indexOf(this), 1);
        }

        if(this.animationStage === 2 && this.number === 1) {
            this.handleDamage();
        }
        this.render();
    }



    render() {
        const ctx = Game.getInstance().canvasCtx;
        get_image('player/grenade', 'grenade', this.animationStage, (img) => {
            drawRotated({
                canvas: ctx,
                img: img,
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height / 2,
                },
                angle: this.rotation,
            });
        });
    }

    handleDamage(){
        const enemies = Game.getInstance().enemyList;

        for(const enemy of enemies) {
            if(enemy.currState === enemy.dieState) continue;
            const dx = this.position.x - enemy.position.x;
            const dy = this.position.y - enemy.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < 250) {
                enemy.damage({
                    amount: 3,
                    angle: -Math.atan2(dy, dx),
                })
            }
        }
    }
}
