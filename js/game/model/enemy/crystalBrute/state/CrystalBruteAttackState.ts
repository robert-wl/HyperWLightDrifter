import CrystalBruteBaseState from './CrystalBruteBaseState.js';
import Game from '../../../game/Game.js';
import CrystalAttack from '../CrystalAttack.js';
import GameSettings from '../../../../constants.js';
import CrystalBrute from '../CrystalBrute.js';
import AssetManager from '../../../utility/manager/AssetManager.js';
import DirectionHelper from '../../../utility/helper/DirectionHelper.js';
import RandomHelper from '../../../utility/helper/RandomHelper.js';
import AngleHelper from '../../../utility/helper/AngleHelper.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';

export default class CrystalBruteAttackState extends CrystalBruteBaseState {
    private angle: number;
    private hasAttacked: boolean;
    private attackPattern: number[][];

    public constructor() {
        super();
        this.angle = 0;
        this.hasAttacked = false;
        this.attackPattern = GameSettings.GAME.ENEMY.CRYSTAL_BRUTE.ATTACK_PATTERN;
    }

    public enterState(currBrute: CrystalBrute) {
        super.enterState(currBrute);
        this.angle = currBrute.angle;
        this.hasAttacked = false;

        const { centerPosition } = Game.getInstance().player;

        currBrute.speed = 0;
        currBrute.angle = AngleHelper.getAngle({
            x: centerPosition.x - currBrute.position.x,
            y: centerPosition.y - currBrute.position.y,
        });
    }

    public updateState(currBrute: CrystalBrute) {
        super.updateState(currBrute);

        if (currBrute.health <= 0) {
            currBrute.switchState(currBrute.dieState);
            return;
        }

        this.advanceAnimationStage(5);

        if (this.animationStage >= 9 && !this.hasAttacked) {
            this.handleAttack(currBrute);
            this.hasAttacked = true;
        }

        if (this.animationStage >= 21) {
            currBrute.switchState(currBrute.moveState);
        }
    }

    public drawImage(currBrute: CrystalBrute) {
        const bruteAttack = AssetManager.getNumberedImage('crystal_brute_attack', this.animationStage);

        const imageSize = Box.parse({
            x: currBrute.position.x,
            y: currBrute.position.y,
            w: bruteAttack.width * GameSettings.GAME.GAME_SCALE,
            h: bruteAttack.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(bruteAttack, imageSize, true, DirectionHelper.getFaceDirection(currBrute.angle) === 'left');
    }

    private handleAttack(currBrute: CrystalBrute) {
        const { player, camera } = Game.getInstance();
        const { centerPosition } = player;

        const angle = AngleHelper.getAngle({
            x: centerPosition.x - currBrute.position.x,
            y: centerPosition.y - currBrute.position.y,
        });

        const type = RandomHelper.randomValue(0, 3, true);

        camera.setShakeCamera({
            duration: 200,
            strength: 10,
        });

        this.attackPattern[type].forEach((num, index) => {
            currBrute.attack.push(
                new CrystalAttack(
                    {
                        x: currBrute.position.x,
                        y: currBrute.position.y,
                    },
                    angle + Math.PI * num,
                    index === 0,
                    currBrute.attackObserver,
                ),
            );
        });
    }
}
