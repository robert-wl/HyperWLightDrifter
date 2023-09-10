import Game from '../../Game/Game.js';
import { get_image } from '../../../helper/fileReader.js';
import Enemy from '../Enemy.js';
import HealthBar from "../healthBar/HealthBar.js";

const playerOffset = {
    x: -20,
    y: -20,
};
export default class JudgementBomb extends Enemy {
    static generate({ position, angle }) {
        console.log(angle);
        const newJudgementBomb = new JudgementBomb({
            position,
            angle: angle,
            offset: 120,
            lifetime: 200 + Math.random() * 200,
        });
        Game.getInstance().enemyList.push(newJudgementBomb);
    }
    constructor({ position, offset, angle, lifetime }) {
        super({
            x: position.x,
            y: position.y,
            hitbox: {
                x: 30 + offset * Math.cos(angle) + playerOffset.x,
                y: 30 + offset * Math.sin(angle) + playerOffset.y,
                w: 10,
                h: 10,
            },
            w: 50,
            h: 50,
            health: 3,
            maxHealth: 3,
        });
        this.angle = angle;
        this.offset = offset;
        this.positionZ = position;
        this.spawning = true;
        this.lifeTime = lifetime;
        this.animationStage = 1;
        this.number = 0;
        this.healthbar = HealthBar.generate({
            position: this.position,
            offset: {
                x: this.width / 2,
                y: 0,
            },
            maxHealth: this.maxHealth,
        });
        this.moveAngle = Math.random() * Math.PI * 2;
    }

    update() {
        this.number++;
        if (this.spawning && this.number % 10 === 0) {
            if (this.animationStage < 5) {
                this.animationStage++;
            }
        }

        if (this.animationStage === 5 && this.number % 10 === 1 && Math.random() < 0.15) {
            this.animationStage--;

            if (!this.spawning) {
                this.moveAngle = Math.random() * Math.PI * 2;
            }
        }

        if (this.animationStage < 5 && this.number % 10 === 0 && !this.spawning) {
            this.animationStage++;
        }

        if (this.spawning) {
            this.position = { ...this.positionZ };
        }

        if (!this.spawning) {
            this.lifeTime--;
            this.position = { ...this.position };
            this.position.x += Math.cos(this.moveAngle);
            this.position.y += Math.sin(this.moveAngle);
        }

        this.render();

        this.healthbar.update({
            health: this.health,
            x: this.position.x + this.hitbox.x - 4,
            y: this.position.y + this.hitbox.y + 40,
        });

        if(this.health <= 0) {
            this.kill();
        }
        if (Game.getInstance().debug) {
            //TODO BENERIN INI
            // this.position.x += this.offset * Math.cos(this.angle) + playerOffset.x;
            // this.position.y += this.offset * Math.sin(this.angle) + playerOffset.y;
            this.debugMode();
        }
    }

    kill() {
        Game.getInstance().enemyList.splice(Game.getInstance().enemyList.indexOf(this), 1);
    }

    render() {
        const ctx = Game.getInstance().ctx;
        get_image('boss/bomb', 'judgement_bomb', this.animationStage, (img) => {
            const position = {
                x: this.position.x + this.offset * Math.cos(this.angle) + playerOffset.x,
                y: this.position.y + this.offset * Math.sin(this.angle) + playerOffset.y,
            };
            ctx.drawImage(img, position.x, position.y, img.width * 2, img.height * 2);
        });
    }
}
