import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../Game/Game.js';
import JudgementBomb from '../JudgementBomb.js';

export default class JudgementBombState extends JudgementBaseState {
    enterState(currJudgement) {
        this.number = 0;
        this.animationStage = 1;
        this.maxAttackCount = 2;
        this.attackCount = 0;
        this.attacking = 5;
        this.attackAngle = currJudgement.angle;
        this.startAngle = Math.random() * Math.PI;
    }

    updateState(currJudgement) {
        this.number++;

        if (this.number % 2 === 0 && this.attackCount < this.maxAttackCount) {
            this.animationStage++;
            if (Game.getInstance().backgroundOpacity >= 0.049) {
                Game.getInstance().backgroundOpacity -= 0.05;

                if (Game.getInstance().backgroundOpacity < 0.05) {
                    Game.getInstance().backgroundOpacity = 0;
                }
            }
        }

        if(this.number % 100 === 0 && this.attackCount === this.maxAttackCount) {
            for(const bomb of Game.getInstance().enemyList) {
                if(bomb instanceof JudgementBomb) {
                    bomb.spawning = false;
                }
            }
            this.attackCount++;
        }

        if (Game.getInstance().backgroundOpacity < 0.05 && this.number % 50 === 0 && this.attackCount < this.maxAttackCount) {
            JudgementBomb.generate({
                position: Game.getInstance().player.position,
                angle: this.startAngle + (this.attackCount * Math.PI) / 4,
            });
            this.attackCount++;
        }

        if(this.attackCount >= this.maxAttackCount + 1 && this.number % 2 === 0) {
            Game.getInstance().backgroundOpacity += 0.05;
            this.attackCount++;
        }


        // console.log(Game.getInstance().backgroundOpacity);

        // if (this.animationStage === 7) {
        //     const player = Game.getInstance().player;
        //     this.attackAngle = Math.atan2(
        //         (player.position.y) - (currJudgement.position.y + currJudgement.height + 40),
        //         (player.position.x) - (currJudgement.position.x + currJudgement.width / 2),
        //     )
        //     currJudgement.angle = this.attackAngle;
        // }
    }
}
