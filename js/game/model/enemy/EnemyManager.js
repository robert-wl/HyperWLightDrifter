


export default class EnemyManager {
    static instance = null;
    constructor() {
        this.enemyList = [];
    }

    static getInstance() {
        if (this.instance == null) {
            this.instance = new EnemyManager();
        }
        return this.instance;
    }

    update() {
        this.enemyList.forEach((enemy) => {
            enemy.update();
        });
    }

    kill(enemy) {
        this.enemyList = this.enemyList.filter((e) => e !== enemy);
    }

    killAll() {
        this.enemyList = [];
    }
}
