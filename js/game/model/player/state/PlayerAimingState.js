import PlayerBaseState from './PlayerBaseState.js';
import { getMouseDirection } from '../../../helper/collision/directionHandler.js';
import { drawImage, drawRotated } from '../../../helper/renderer/drawer.js';
import Game from '../../Game/Game.js';
import { getImage } from '../../../helper/imageLoader.js';
import GameSettings from '../../../constants.js';
import { drawExplosion, drawShootLine, shootHandler } from '../../../helper/player/gunHelper.js';
import { getHorizontalValue, getVerticalValue } from '../../../helper/distanceHelper.js';

const scale = 2;
export default class PlayerAimingState extends PlayerBaseState {
    enterState(currPlayer) {
        this.exploding = 0;
        this.shooting = 0;
        this.canAim = true;
        this.length = 0;
        this.enemy = null;
    }

    updateState(currPlayer) {
        const { clicks } = Game.getInstance();
        this.angle = currPlayer.lookAngle;

        if (this.shooting > 0) {
            this.shooting -= 1;
        }

        this.handleRecoil(currPlayer);
        this.direction = getMouseDirection({
            angle: this.angle,
        });

        if (!clicks.includes('right') && this.shooting === 0) {
            currPlayer.handleSwitchState({
                move: true,
                attackOne: true,
                dash: true,
                throws: true,
            });

            return;
        }

        if (clicks.includes('left') && currPlayer.bullets > 0) {
            this.shooting = 20;
        }

        if (this.shooting > 10) {
            shootHandler({
                currPlayer,
                clicks,
                angle: this.angle,
                length: this.length,
                first: this.shooting === 20,
            });

            drawExplosion({
                distance: this.length,
                currPlayer: currPlayer,
                angle: this.angle,
                number: this.shooting >= 16 ? 1 : 2,
            });

            this.canAim = false;
            this.exploding = 5;
        }

        if (this.shooting === 20) {
            this.enemy?.damage({
                amount: 2,
                angle: this.angle,
            });
        }

        if (this.canAim) {
            const { audio } = Game.getInstance();
            audio.playAudio('player/gun_aim.wav');
            this.canAim = false;
        }
    }

    handleRecoil(currPlayer) {
        if (this.shooting !== 11) {
            return;
        }
        currPlayer.direction.x = getHorizontalValue({
            magnitude: currPlayer.playerDefault.GUN.RECOIL * 3,
            angle: this.angle + Math.PI,
        });
        currPlayer.direction.y = getVerticalValue({
            magnitude: currPlayer.playerDefault.GUN.RECOIL * 3,
            angle: this.angle + Math.PI,
        });

        const { camera } = Game.getInstance();

        camera.setShakeCamera({
            duration: currPlayer.playerDefault.GUN.RECOIL * 20,
            angle: this.angle + Math.PI,
        });
    }
    drawImage(currPlayer) {
        if (this.shooting === 0) {
            const { length, enemy } = drawShootLine(currPlayer);
            this.length = length;
            this.enemy = enemy;
        }
        if (this.direction === 'w') {
            const aimTop = getImage('aim_top');

            this.drawPlayer({
                image: aimTop,
                currPlayer: currPlayer,
                gunOffset: {
                    x: currPlayer.playerDefault.GUN.OFFSET.UP.X,
                    y: currPlayer.playerDefault.GUN.OFFSET.UP.Y,
                },
                playerOffset: {
                    x: -70,
                    y: -30,
                },
                angle: this.angle + (Math.PI - Math.PI / 16),
            });

            return;
        }
        if (this.direction === 'a') {
            const aimSide = getImage('aim_side');

            this.drawPlayer({
                image: aimSide,
                currPlayer: currPlayer,
                gunOffset: {
                    x: currPlayer.playerDefault.GUN.OFFSET.LEFT.X,
                    y: currPlayer.playerDefault.GUN.OFFSET.LEFT.Y,
                },
                playerOffset: {
                    x: -70,
                    y: -30,
                },
                angle: this.angle + 3 * Math.PI,
                mirrored: true,
            });

            return;
        }
        if (this.direction === 's') {
            const aimBottom = getImage('aim_bottom');

            this.drawPlayer({
                image: aimBottom,
                currPlayer: currPlayer,
                gunOffset: {
                    x: currPlayer.playerDefault.GUN.OFFSET.BOTTOM.X,
                    y: currPlayer.playerDefault.GUN.OFFSET.BOTTOM.Y,
                },
                playerOffset: {
                    x: -70,
                    y: -30,
                },
                angle: this.angle + 3 * Math.PI,
                bottom: true,
            });

            return;
        }
        if (this.direction === 'd') {
            const aimSide = getImage('aim_side');

            this.drawPlayer({
                image: aimSide,
                currPlayer: currPlayer,
                gunOffset: {
                    x: currPlayer.playerDefault.GUN.OFFSET.RIGHT.X,
                    y: currPlayer.playerDefault.GUN.OFFSET.RIGHT.Y,
                },
                playerOffset: {
                    x: -70,
                    y: -30,
                },
                angle: this.angle + 3 * Math.PI,
            });
        }
    }

    drawPlayer({ image, currPlayer, angle, mirrored = false, bottom = false }) {
        const railgun = getImage('railgun');

        if (!bottom) {
            drawRotated({
                img: railgun,
                position: {
                    x: currPlayer.centerPosition.x,
                    y: currPlayer.centerPosition.y,
                },
                angle: angle,
                mirrored: mirrored,
            });
        }

        drawImage({
            img: image,
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            width: image.width * GameSettings.game.GAME_SCALE,
            height: image.height * GameSettings.game.GAME_SCALE,
            translate: true,
            mirrored: mirrored,
        });

        if (bottom) {
            drawRotated({
                img: railgun,
                position: {
                    x: currPlayer.centerPosition.x,
                    y: currPlayer.centerPosition.y,
                },
                angle: angle,
                mirrored: mirrored,
            });
        }

        if (this.exploding <= 0) {
            return;
        }

        this.exploding--;

        // drawEffect({
        //     explosionDistance: -currPlayer.playerDefault.EFFECT_DISTANCE,
        //     currPlayer: currPlayer,
        //     angle: angle,
        // });
    }
}
