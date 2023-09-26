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
    updateState(currPlayer) {
        const { clicks, deltaTime } = Game.getInstance();
        this.angle = currPlayer.lookAngle;

        if (this.shooting > 0) {
            this.shooting -= deltaTime;
        }

        this.handleRecoil(currPlayer);
        this.direction = getMouseDirection({
            angle: this.angle,
        });

        if (!clicks.includes('right') && this.shooting <= 0) {
            currPlayer.handleSwitchState({
                move: true,
                attackOne: true,
                dash: true,
                throws: true,
            });

            return;
        }

        if (clicks.includes('left') && currPlayer.bullets > 0 && this.shooting <= 0) {
            this.shooting = 20;
        }

        if (this.shooting >= 10) {
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

        if (this.shooting >= 20) {
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

    drawImage(currPlayer) {
        if (this.shooting <= 0) {
            const { length, enemy } = drawShootLine(currPlayer);
            this.length = length;
            this.enemy = enemy;
        }

        const { image, offset, angle, mirrored, bottom } = this.getAimDrawConstant(currPlayer);

        if (!image) {
            return;
        }

        this.drawPlayer({
            image: image,
            currPlayer: currPlayer,
            gunOffset: {
                x: offset.x,
                y: offset.y,
            },
            playerOffset: {
                x: -70,
                y: -30,
            },
            angle: angle,
            mirrored: mirrored,
            bottom: bottom,
        });
    }

    enterState(currPlayer) {
        this.exploding = 0;
        this.shooting = 0;
        this.canAim = true;
        this.length = 0;
        this.enemy = null;
        this.hasKnockedBack = false;
    }

    getAimDrawConstant(currPlayer) {
        if (this.direction === 'w') {
            return {
                image: getImage('aim_top'),
                offset: {
                    x: currPlayer.playerDefault.GUN.OFFSET.UP.X,
                    y: currPlayer.playerDefault.GUN.OFFSET.UP.Y,
                },
                angle: this.angle + (Math.PI - Math.PI / 16),
                mirrored: false,
            };
        }
        if (this.direction === 'a') {
            return {
                image: getImage('aim_side'),
                offset: {
                    x: currPlayer.playerDefault.GUN.OFFSET.LEFT.X,
                    y: currPlayer.playerDefault.GUN.OFFSET.LEFT.Y,
                },
                angle: this.angle + 3 * Math.PI,
                mirrored: true,
            };
        }
        if (this.direction === 's') {
            return {
                image: getImage('aim_bottom'),
                offset: {
                    x: currPlayer.playerDefault.GUN.OFFSET.BOTTOM.X,
                    y: currPlayer.playerDefault.GUN.OFFSET.BOTTOM.Y,
                },
                angle: this.angle + 3 * Math.PI,
                mirrored: false,
                bottom: true,
            };
        }
        if (this.direction === 'd') {
            return {
                image: getImage('aim_side'),
                offset: {
                    x: currPlayer.playerDefault.GUN.OFFSET.RIGHT.X,
                    y: currPlayer.playerDefault.GUN.OFFSET.RIGHT.Y,
                },
                angle: this.angle + 3 * Math.PI,
                mirrored: false,
            };
        }

        return {};
    }

    handleRecoil(currPlayer) {
        if (this.shooting >= 11 || this.shooting <= 0 || this.hasKnockedBack) {
            return;
        }

        const { movementDeltaTime } = Game.getInstance();
        this.hasKnockedBack = true;

        currPlayer.velocity.x = getHorizontalValue({
            magnitude: currPlayer.playerDefault.GUN.RECOIL * 3 * movementDeltaTime,
            angle: this.angle + Math.PI,
        });
        currPlayer.velocity.y = getVerticalValue({
            magnitude: currPlayer.playerDefault.GUN.RECOIL * 3 * movementDeltaTime,
            angle: this.angle + Math.PI,
        });

        const { camera } = Game.getInstance();

        camera.setShakeCamera({
            duration: currPlayer.playerDefault.GUN.RECOIL * 20,
            angle: this.angle + Math.PI,
        });
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

        const { deltaTime } = Game.getInstance();
        this.exploding -= deltaTime;

        // drawEffect({
        //     explosionDistance: -currPlayer.playerDefault.EFFECT_DISTANCE,
        //     currPlayer: currPlayer,
        //     angle: angle,
        // });
    }
}
