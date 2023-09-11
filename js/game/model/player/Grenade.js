import Game from '../Game/Game.js';
import { get_image } from '../../helper/fileReader.js';
import { drawRotated } from '../../helper/renderer/drawer.js';
import { getRandomValue } from '../../helper/randomHelper.js';
import { getHorizontalValue, getMagnitudeValue, getVerticalValue } from '../../helper/distanceHelper.js';
import { getNumberedImage } from '../../helper/imageLoader.js';
import { getAngle } from '../../helper/angleHelper.js';

export default class Grenade {
    static generate({ x, y, angle }) {
        const newGrenade = new Grenade({
            x,
            y,
            w: 16,
            h: 16,
            angle,
            velocity: 10,
        });
        Game.getInstance().player.projectiles.push(newGrenade);
    }
    constructor({ x, y, w, h, angle, velocity }) {
        this.position = {
            x: x,
            y: y,
        };
        this.width = w;
        this.height = h;
        this.angle = angle;
        this.velocity = velocity;
        this.rotation = getRandomValue({
            randomValue: Math.PI * 7,
        });
        this.friction = 0.97;
        this.number = 0;
        this.animationStage = 1;
    }

    update() {
        this.number += 1;
        this.position.x += getHorizontalValue({
            magnitude: this.velocity,
            angle: this.angle,
        });

        this.position.y += getVerticalValue({
            magnitude: this.velocity,
            angle: this.angle,
        });
        this.velocity *= this.friction;

        if (this.animationStage === 1 && this.number === 50) {
            this.animationStage += 1;
            this.number = 0;
        }
        if (this.animationStage > 1 && this.animationStage < 11 && this.number === 2) {
            this.velocity = 0;
            this.animationStage += 1;
            this.number = 0;
        }
        if (this.animationStage === 11) {
            const { projectiles } = Game.getInstance().player;

            projectiles.splice(projectiles.indexOf(this), 1);
        }

        if (this.animationStage === 2 && this.number === 1) {
            this.handleDamage();
        }
        this.render();
    }

    render() {
        const grenade = getNumberedImage('grenade', this.animationStage);

        drawRotated({
            img: grenade,
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height / 2,
            },
            angle: this.rotation,
        });
    }

    handleDamage() {
        const { enemyList } = Game.getInstance();

        enemyList.forEach((enemy) => {
            if (enemy.currState !== enemy.dieState) {
                const distance = getMagnitudeValue({
                    x: this.position.x - enemy.position.x,
                    y: this.position.y - enemy.position.y,
                });

                const angle = getAngle({
                    x: this.position.x - enemy.position.x,
                    y: this.position.y - enemy.position.y,
                });

                if (distance < 250) {
                    enemy.damage({
                        amount: 3,
                        angle: -angle,
                    });
                }
            }
        });
    }
}
