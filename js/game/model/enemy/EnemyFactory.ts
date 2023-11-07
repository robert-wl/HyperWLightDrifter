import CrystalSpider from './crystalSpider/CrystalSpider.js';
import GameSettings from '../../constants.js';
import HitBoxComponent from '../utility/HitBoxComponent.js';
import Observable from '../utility/Observable.js';
import CrystalBrute from './crystalBrute/CrystalBrute.js';
import { getRandomBoolean } from '../../helper/randomHelper.js';

export default class EnemyFactory {
    private eventEmitter: Observable;

    public constructor(eventEmitter: Observable) {
        this.eventEmitter = eventEmitter;
    }

    public generateCrystalSpider(position: Position) {
        const { WIDTH, HEIGHT, MAX_HEALTH } = GameSettings.GAME.ENEMY.CRYSTAL_SPIDER;
        const hitbox = new HitBoxComponent(-WIDTH / 2, -HEIGHT / 2, 0, 0);

        const newCrystalSpider = new CrystalSpider(position, WIDTH, HEIGHT, hitbox, MAX_HEALTH);

        this.eventEmitter.notify('spawnEnemy', newCrystalSpider);
    }

    public generateCrystalBrute(position: Position) {
        const { WIDTH, HEIGHT, MAX_HEALTH } = GameSettings.GAME.ENEMY.CRYSTAL_BRUTE;
        const hitbox = new HitBoxComponent(30 + -WIDTH / 2, 30 + -HEIGHT / 2, 50, 30);
        const newCrystalBrute = new CrystalBrute(position, WIDTH, HEIGHT, hitbox, MAX_HEALTH);

        this.eventEmitter.notify('spawnEnemy', newCrystalBrute);
    }

    public generateEnemy(position: Position) {
        if (getRandomBoolean(GameSettings.GAME.FOREST_STAGE.SPIDER_SPAWN_CHANCE)) {
            this.generateCrystalSpider(position);
            return;
        }

        this.generateCrystalBrute(position);
    }
}
