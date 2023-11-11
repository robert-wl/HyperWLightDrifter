import PlayerBaseState from './PlayerBaseState.js';
import Game from '../../game/Game.js';
import GameSettings from '../../../constants.js';
import Player from '../Player.js';
import AssetManager from '../../utility/manager/AssetManager.js';
import DirectionHelper from '../../utility/helper/DirectionHelper.js';
import { Vector } from '../../utility/interfaces/Vector.js';
import GunHelper from '../../utility/helper/GunHelper.js';
import AudioManager from '../../utility/manager/AudioManager.js';
import { PolarVector } from '../../utility/interfaces/PolarVector.js';
import DistanceHelper from '../../utility/helper/DistanceHelper.js';
import { Box } from '../../utility/interfaces/Box.js';
import DrawHelper from '../../utility/helper/DrawHelper.js';

export default class PlayerAimingState extends PlayerBaseState {
    private exploding: number;
    private shooting: number;
    private canAim: boolean;
    private length: number;
    private hasKnockedBack: boolean;
    private finalTracePosition: Vector;
    private angle: number;
    private direction: string;

    public constructor() {
        super();
        this.exploding = 0;
        this.shooting = 0;
        this.canAim = true;
        this.length = 0;
        this.hasKnockedBack = false;
        this.finalTracePosition = Vector.Zero();
        this.angle = 0;
        this.direction = '';
    }

    enterState(currPlayer: Player) {
        this.exploding = 0;
        this.shooting = 0;
        this.canAim = true;
        this.length = 0;
        this.hasKnockedBack = false;
        AudioManager.playAudio('player_gun_aim_audio').then();
    }

    updateState(currPlayer: Player) {
        this.angle = currPlayer.lookAngle;

        if (this.shooting > 0) {
            this.shooting -= Game.deltaTime;
        }

        this.handleRecoil(currPlayer);
        this.direction = DirectionHelper.getMouseDirection(this.angle);

        if (!currPlayer.clicks.includes('right') && this.shooting <= 0) {
            currPlayer.handleSwitchState({
                move: true,
                attackOne: true,
                dash: true,
                throws: true,
            });

            return;
        }

        if (currPlayer.clicks.includes('left') && currPlayer.bullets > 0 && this.shooting <= 0) {
            this.shooting = 20;
        }

        if (this.shooting >= 10) {
            this.shootHandler(currPlayer, this.angle, this.length, this.shooting === 20);
            {
                currPlayer.clicks.splice(currPlayer.clicks.indexOf('left'), 1);

                this.drawExplosion({
                    distance: this.length,
                    currPlayer: currPlayer,
                    angle: this.angle,
                    number: this.shooting >= 16 ? 1 : 2,
                });

                this.canAim = false;
                this.exploding = 5;
            }

            if (this.shooting >= 20) {
                GunHelper.damageTargetPosition(this.finalTracePosition);
            }

            if (this.canAim) {
                this.canAim = false;
            }
        }
    }

    drawImage(currPlayer: Player) {
        if (this.shooting <= 0) {
            this.length = this.drawShootLine(currPlayer);
        }

        const { image, angle, mirrored, bottom } = this.getAimDrawConstant();

        if (!image) {
            return;
        }

        this.drawPlayer({
            image: image,
            currPlayer: currPlayer,
            // gunOffset: {
            //     x: offset.x,
            //     y: offset.y,
            // },
            // playerOffset: {
            //     x: -70,
            //     y: -30,
            // },
            angle: angle,
            mirrored: mirrored,
            bottom: bottom,
        });
    }

    drawPlayer({ image, currPlayer, angle, mirrored = false, bottom = false }) {
        const railgun = AssetManager.getImage('railgun');

        if (!bottom) {
            const imageSize = Box.parse({
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                w: railgun.width * GameSettings.GAME.GAME_SCALE,
                h: railgun.height * GameSettings.GAME.GAME_SCALE,
            });

            DrawHelper.drawRotated(railgun, imageSize, angle, mirrored);
        }

        const imageSize = Box.parse({
            x: currPlayer.centerPosition.x,
            y: currPlayer.centerPosition.y,
            w: image.width * GameSettings.GAME.GAME_SCALE,
            h: image.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(image, imageSize, true, mirrored);

        if (bottom) {
            const imageSize = Box.parse({
                x: currPlayer.centerPosition.x,
                y: currPlayer.centerPosition.y,
                w: railgun.width * GameSettings.GAME.GAME_SCALE,
                h: railgun.height * GameSettings.GAME.GAME_SCALE,
            });

            DrawHelper.drawRotated(railgun, imageSize, angle, mirrored);
        }

        if (this.exploding <= 0) {
            return;
        }

        this.exploding -= Game.deltaTime;
    }

    private handleRecoil(currPlayer: Player) {
        if (this.shooting >= 11 || this.shooting <= 0 || this.hasKnockedBack) {
            return;
        }

        const { GUN } = GameSettings.PLAYER;
        this.hasKnockedBack = true;

        const pVector = new PolarVector(GUN.RECOIL * 3, this.angle + Math.PI);

        currPlayer.velocity.x = DistanceHelper.getHorizontalValue(pVector);
        currPlayer.velocity.y = DistanceHelper.getVerticalValue(pVector);

        const { camera } = Game.getInstance();

        camera.setShakeCamera({
            duration: GUN.RECOIL * 20,
            angle: this.angle + Math.PI,
        });
    }

    private drawExplosion({ distance, currPlayer, angle, number }) {
        const effect = AssetManager.getNumberedImage('gun_impact', number);

        const pVector = new PolarVector(distance, angle);

        const imageSize = Box.parse({
            x: DistanceHelper.getHorizontalValue(pVector, currPlayer.centerPosition.x),
            y: DistanceHelper.getVerticalValue(pVector, currPlayer.centerPosition.y),
            w: effect.width * GameSettings.GAME.GAME_SCALE,
            h: effect.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(effect, imageSize, true);
    }

    private getAimDrawConstant() {
        const { GUN } = GameSettings.PLAYER;
        if (this.direction === 'w') {
            return {
                image: AssetManager.getImage('aim_top'),
                offset: {
                    x: GUN.OFFSET.UP.X,
                    y: GUN.OFFSET.UP.Y,
                },
                angle: this.angle + (Math.PI - Math.PI / 16),
                mirrored: false,
            };
        }
        if (this.direction === 'a') {
            return {
                image: AssetManager.getImage('aim_side'),
                offset: {
                    x: GUN.OFFSET.LEFT.X,
                    y: GUN.OFFSET.LEFT.Y,
                },
                angle: this.angle + 3 * Math.PI,
                mirrored: true,
            };
        }
        if (this.direction === 's') {
            return {
                image: AssetManager.getImage('aim_bottom'),
                offset: {
                    x: GUN.OFFSET.BOTTOM.X,
                    y: GUN.OFFSET.BOTTOM.Y,
                },
                angle: this.angle + 3 * Math.PI,
                mirrored: false,
                bottom: true,
            };
        }
        if (this.direction === 'd') {
            return {
                image: AssetManager.getImage('aim_side'),
                offset: {
                    x: GUN.OFFSET.RIGHT.X,
                    y: GUN.OFFSET.RIGHT.Y,
                },
                angle: this.angle + 3 * Math.PI,
                mirrored: false,
            };
        }

        return {};
    }

    private drawShootLine(currPlayer: Player) {
        const { ctx } = Game.getInstance();
        const { lookAngle } = currPlayer;

        let length = 1200;
        for (let i = 0; i < 300; i++) {
            const pVector = new PolarVector(i * 3, lookAngle);
            const x = DistanceHelper.getHorizontalValue(pVector, currPlayer.centerPosition.x);
            const y = DistanceHelper.getVerticalValue(pVector, currPlayer.centerPosition.y);

            const position = new Vector(x, y);

            if (GunHelper.checkTargetPosition(position)) {
                this.finalTracePosition = position;
                length = i * 3 + 10;
                break;
            }
        }
        const pVector = new PolarVector(length, lookAngle);
        const x = DistanceHelper.getHorizontalValue(pVector, currPlayer.centerPosition.x);
        const y = DistanceHelper.getVerticalValue(pVector, currPlayer.centerPosition.y);

        const lineWidth = 2;
        ctx.beginPath();
        ctx.strokeStyle = `rgb(255, 0, 0, ${Math.random() * 0.5 + 0.1})`;
        ctx.lineWidth = lineWidth;
        ctx.translate(-lineWidth / 2, -lineWidth / 2);
        ctx.moveTo(currPlayer.centerPosition.x, currPlayer.centerPosition.y);
        ctx.lineTo(x, y);
        ctx.translate(lineWidth / 2, lineWidth / 2);
        ctx.stroke();

        return length;
    }

    private shootHandler(currPlayer: Player, angle: number, length: number, first: boolean) {
        this.drawRay(currPlayer, angle, length);

        if (first) {
            currPlayer.bullets -= 1;
            AudioManager.playAudio('player_gun_fire_audio').then();
        }
    }

    private drawRay(currPlayer: Player, angle: number, length: number) {
        const rayImage = AssetManager.getImage('gun_ray');

        let { x, y } = currPlayer.centerPosition;
        for (let i = 0; i < length; i += 3) {
            const pVector = new PolarVector(3, angle);
            x = DistanceHelper.getHorizontalValue(pVector, x);
            y = DistanceHelper.getVerticalValue(pVector, y);

            const imageSize = Box.parse({
                x: x,
                y: y,
                w: rayImage.width * GameSettings.GAME.GAME_SCALE,
                h: rayImage.height * GameSettings.GAME.GAME_SCALE,
            });

            DrawHelper.drawRotatedRay(rayImage, imageSize, angle);
        }
    }
}
