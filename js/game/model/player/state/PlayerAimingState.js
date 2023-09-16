import PlayerBaseState from './PlayerBaseState.js';
import { getMouseDirection } from '../../../helper/collision/directionHandler.js';
import { drawImage, drawMirroredY, drawRotated } from '../../../helper/renderer/drawer.js';
import Game from '../../Game/Game.js';
import GunProjectile from '../GunProjectile.js';
import { getHorizontalValue, getVerticalValue } from '../../../helper/distanceHelper.js';
import { getImage } from '../../../helper/imageLoader.js';
import GameSettings from '../../../constants.js';

const scale = 2;
export default class PlayerAimingState extends PlayerBaseState {
    canAim = true;
    exploding = 0;
    updateState(currPlayer) {
        const { lookAngle } = currPlayer;
        const { clicks } = Game.getInstance();

        this.angle = lookAngle;

        this.direction = getMouseDirection({
            angle: lookAngle,
        });

        if (!clicks.includes('right')) {
            this.canAim = true;
            currPlayer.handleSwitchState({
                move: true,
                attackOne: true,
                dash: true,
                throws: true,
            });

            return;
        }

        if (clicks.includes('left') && currPlayer.bullets > 0) {
            this.shootHandler({
                currPlayer,
                clicks,
            });

            return;
        }

        if(this.canAim) {
            const { audio } = Game.getInstance();
            audio.playAudio('player/gun_aim.wav');
            this.canAim = false;
        }
    }

    shootHandler({ currPlayer, clicks }) {
        currPlayer.bullets -= 1;

        const projectilePosition = {
            x: getHorizontalValue({
                initial: currPlayer.centerPosition.x,
                magnitude: currPlayer.playerDefault.PROJECTILE_OFFSET,
                angle: this.angle,
            }),
            y: getVerticalValue({
                initial: currPlayer.centerPosition.y,
                magnitude: currPlayer.playerDefault.PROJECTILE_OFFSET,
                angle: this.angle,
            }),
        };

        GunProjectile.generate({
            position: projectilePosition,
            angle: this.angle,
        });

        clicks.splice(clicks.indexOf('left'), 1);

        currPlayer.direction.x = getHorizontalValue({
            magnitude: currPlayer.playerDefault.GUN.RECOIL,
            angle: this.angle + Math.PI,
        });
        currPlayer.direction.y = getVerticalValue({
            magnitude: currPlayer.playerDefault.GUN.RECOIL,
            angle: this.angle + Math.PI,
        });

        const { audio } = Game.getInstance();
        audio.playAudio('player/bullet_travel.wav');

        this.canAim = false;

        this.exploding = 5;
    }
    drawImage(currPlayer) {
        // this.drawShootLine(currPlayer)
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

    drawShootLine(currPlayer) {
        const { ctx } = Game.getInstance();
        const { lookAngle } = currPlayer;

        const x = getHorizontalValue({
            initial: currPlayer.centerPosition.x,
            magnitude: 1000,
            angle: lookAngle,
        });
        const y = getVerticalValue({
            initial: currPlayer.centerPosition.y,
            magnitude: 1000,
            angle: lookAngle,
        });

        const lineWidth = 2;
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(255, 0, 0, 0.5)';
        ctx.lineWidth = lineWidth;
        ctx.translate(-lineWidth / 2, -lineWidth / 2);
        ctx.moveTo(currPlayer.centerPosition.x, currPlayer.centerPosition.y);
        ctx.lineTo(x, y);
        ctx.translate(lineWidth / 2, lineWidth / 2);
        ctx.stroke();
    }
    drawPlayer({ image, currPlayer, gunOffset, playerOffset, angle, mirrored = false, bottom = false }) {
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

        console.log(currPlayer.playerDefault.EXPLOSION_DISTANCE)
        this.drawExplosion({
            explosionDistance: -currPlayer.playerDefault.EXPLOSION_DISTANCE,
            currPlayer: currPlayer,
            angle: angle,
        });
    }

    drawExplosion({ explosionDistance, currPlayer, angle }) {
        //TODO FIX THIS
        const { ctx } = Game.getInstance();
        const x = getHorizontalValue({
            initial: currPlayer.centerPosition.x,
            magnitude: explosionDistance,
            angle: angle,
        });
        const y = getVerticalValue({
            initial: currPlayer.centerPosition.y,
            magnitude: explosionDistance,
            angle: angle,
        });

        const explosion = getImage('gun_explosion');

        ctx.translate(-explosion.width, -explosion.height);
        ctx.drawImage(
            explosion,
            x,
            y,
            explosion.width * GameSettings.game.GAME_SCALE,
            explosion.height * GameSettings.game.GAME_SCALE
        );
        ctx.translate(explosion.width, explosion.height);
    }
}
