import GameSettings from '../../constants';

export default class TimeService {
    private static instance: TimeService | null = null;
    private _deltaTime: number;
    private _movementDeltaTime: number;

    constructor() {
        this._deltaTime = 0;
        this._movementDeltaTime = 0;
    }

    get deltaTime(): number {
        return this._deltaTime;
    }

    set deltaTime(value: number) {
        this._deltaTime = value;
    }

    get movementDeltaTime(): number {
        return this._movementDeltaTime;
    }

    set movementDeltaTime(value: number) {
        this._movementDeltaTime = value;
    }

    public static getInstance() {
        if (TimeService.instance == null) {
            TimeService.instance = new TimeService();
        }
        return TimeService.instance;
    }

    public update(deltaTime: number) {
        this._deltaTime = deltaTime * GameSettings.GAME.GAME_SPEED;
        this._movementDeltaTime = Math.cbrt(deltaTime * GameSettings.GAME.GAME_SPEED);
    }
}
