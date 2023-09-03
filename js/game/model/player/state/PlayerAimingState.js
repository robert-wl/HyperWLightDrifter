import PlayerBaseState from './PlayerBaseState.js';
import { getMouseDirection, getMoveDirection } from '../../../helper/collision/directionHandler.js';
import { get_image } from '../../../helper/fileReader.js';
import { drawMirroredY, drawRotated } from '../../../helper/renderer/drawer.js';
import Game from '../../Game.js';
import GunProjectile from '../GunProjectile.js';

const scale = 2;
const recoil = 3;
export default class PlayerAimingState extends PlayerBaseState {
    exploding = 0;
    updateState(currPlayer) {
        const angle = currPlayer.lookAngle;

        this.angle = angle;

        this.direction = getMouseDirection({ angle });

        if (!Game.getInstance().clicks.includes('right')) {
            currPlayer.handleSwitchState({
                move: true,
                attackOne: true,
                dash: true,
            });
        }
        if (Game.getInstance().clicks.includes('left') && currPlayer.bullets > 0) {
            currPlayer.bullets--;
            const projectilePosition = {
                x: currPlayer.position.x + currPlayer.width / 2 + 45 * Math.cos(angle),
                y: currPlayer.position.y + currPlayer.height / 2 + 45 * Math.sin(angle),
            };
            GunProjectile.generate({
                position: projectilePosition,
                angle: this.angle,
            });
            Game.getInstance().clicks.splice(Game.getInstance().clicks.indexOf('left'), 1);

            currPlayer.direction.x = recoil * Math.cos(this.angle + Math.PI);
            currPlayer.direction.y = recoil * Math.sin(this.angle + Math.PI);
            this.exploding = 5;
            // Game.getInstance().camera.shakeCamera({
            //     offset: {
            //         x: 0,
            //         y: 5,
            //     }
            // });
        }

        // const {playerDirection } = getMoveDirection({
        //     keys: Game.getInstance().keys,
        //     currPlayer,
        // });
        //
        // currPlayer.direction = {
        //     x: playerDirection.x * 0.8,
        //     y: playerDirection.y * 0.8,
        // }
    }
    drawImage(currPlayer) {
        if (this.direction === 'w') {
            get_image('player/aim/gun', 'railgun', null, (img) => {
                drawRotated({
                    canvas: currPlayer.canvas,
                    img: img,
                    position: {
                        x: currPlayer.position.x + 35,
                        y: currPlayer.position.y + 20,
                    },
                    angle: this.angle + (Math.PI - Math.PI / 16),
                });
            });
            get_image('player/aim', 'aim_top', null, (img) => {
                currPlayer.canvas.drawImage(img, currPlayer.position.x - 70, currPlayer.position.y - 30, img.width * scale, img.height * scale);
            });
            if (this.exploding > 0) {
                this.exploding--;
                this.renderExplosion({
                    position: {
                        x: currPlayer.position.x + currPlayer.width / 2 + 35 * Math.cos(this.angle),
                        y: currPlayer.position.y + currPlayer.height / 2 + 35 * Math.sin(this.angle),
                    },
                });
            }
            return;
        }
        if (this.direction === 'a') {
            get_image('player/aim/gun', 'railgun', null, (img) => {
                drawRotated({
                    canvas: currPlayer.canvas,
                    img: img,
                    position: {
                        x: currPlayer.position.x + 25,
                        y: currPlayer.position.y + 30,
                    },
                    angle: this.angle + 3 * Math.PI,
                    mirrored: true,
                });
            });
            get_image('player/aim', 'aim_side', null, (img) => {
                drawMirroredY({
                    canvas: currPlayer.canvas,
                    img: img,
                    position: {
                        x: currPlayer.position.x - 75,
                        y: currPlayer.position.y - 30,
                    },
                    width: img.width * scale,
                    height: img.height * scale,
                });
            });
            if (this.exploding > 0) {
                this.exploding--;
                this.renderExplosion({
                    position: {
                        x: currPlayer.position.x + currPlayer.width / 2 + 30 * Math.cos(this.angle),
                        y: currPlayer.position.y + currPlayer.height / 2 + 30 * Math.sin(this.angle),
                    },
                });
            }
            return;
        }
        if (this.direction === 's') {
            get_image('player/aim', 'aim_bottom', null, (img) => {
                currPlayer.canvas.drawImage(img, currPlayer.position.x - 70, currPlayer.position.y - 30, img.width * scale, img.height * scale);
            });
            get_image('player/aim/gun', 'railgun', null, (img) => {
                drawRotated({
                    canvas: currPlayer.canvas,
                    img: img,
                    position: {
                        x: currPlayer.position.x + 30,
                        y: currPlayer.position.y + 32.5,
                    },
                    angle: this.angle + 3 * Math.PI,
                });
            });
            if (this.exploding > 0) {
                this.exploding--;
                this.renderExplosion({
                    position: {
                        x: currPlayer.position.x + currPlayer.width / 2 + 25 * Math.cos(this.angle),
                        y: currPlayer.position.y + currPlayer.height / 2 + 25 * Math.sin(this.angle),
                    },
                });
            }
            return;
        }
        if (this.direction === 'd') {
            get_image('player/aim/gun', 'railgun', null, (img) => {
                drawRotated({
                    canvas: currPlayer.canvas,
                    img: img,
                    position: {
                        x: currPlayer.position.x + 45,
                        y: currPlayer.position.y + 30,
                    },
                    angle: this.angle + 3 * Math.PI,
                });
            });
            get_image('player/aim', 'aim_side', null, (img) => {
                currPlayer.canvas.drawImage(img, currPlayer.position.x - 70, currPlayer.position.y - 30, img.width * scale, img.height * scale);
            });
            if (this.exploding > 0) {
                this.exploding--;
                this.renderExplosion({
                    position: {
                        x: currPlayer.position.x + currPlayer.width / 2 + 35 * Math.cos(this.angle),
                        y: currPlayer.position.y + currPlayer.height / 2 - 5 + 35 * Math.sin(this.angle),
                    },
                });
            }
        }
    }

    renderExplosion({ position }) {
        const ctx = Game.getInstance().canvasCtx;
        get_image('player/aim/gun', 'gun_explosion', null, (img) => {
            ctx.translate(-img.width, -img.height);
            ctx.drawImage(img, position.x, position.y, img.width * 3, img.height * 3);
            ctx.translate(img.width, img.height);
        });
    }

    enterState(currPlayer) {}
    exitState(currPlayer) {}
}
