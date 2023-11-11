import Player from '../player/Player.js';
import Camera from '../camera/Camera.js';
import GameSettings from '../../constants.js';
import EnemyManager from '../enemy/EnemyManager.js';
import GameStartState from './state/GameStartState.js';
import GameStageOneState from './state/GameStageOneState.js';
import GameStageTwoState from './state/GameStageTwoState.js';
import GamePausedState from './state/GamePausedState.js';
import GameBaseState from './state/GameBaseState.js';
import GameLoseState from './state/GameLoseState.js';
import MapGenerator from '../map/MapGenerator.js';
import GameEndState from './state/GameEndState.js';
import HTMLHandlers from '../htmlElements/HTMLHandlers.js';
import ParticlesManager from '../particles/ParticlesManager.js';
import InteractablesFactory from '../interactables/InteractablesFactory.js';
import CheatCodeManager from '../utility/manager/CheatCodeManager.js';
import InputManager from '../utility/InputManager.js';
import AssetManager from '../utility/manager/AssetManager.js';
import ParticlesFactory from '../particles/ParticlesFactory.js';
import InteractablesManager from '../interactables/InteractablesManager.js';
import SetPiece from '../map/setPieces/SetPiece.js';
import GunHelper from '../utility/helper/GunHelper.js';
import DrawHelper from '../utility/helper/DrawHelper.js';
import HUDManager from '../utility/manager/HUDManager.js';

export default class Game {
    private static _deltaTime: number = 0;
    private static _movementDeltaTime: number = 0;
    private static _debug: boolean = false;
    private static instance: Game | null = null;
    private static _renderCollider: boolean = false;
    public stage: number;
    public showFPS: boolean;
    public fpsShowCounter: number;
    public fps: number;
    public loading: boolean;
    public player!: Player;
    public width: number;
    public height: number;
    public objects: Map<string, SetPiece>;
    public coins: any[];
    public elevators: any[];
    public elevator: any;
    public enemyManager!: EnemyManager;
    public canvas!: HTMLCanvasElement;
    public ctx!: CanvasRenderingContext2D;
    public backgroundOpacity: number;
    public coinCount: number;
    public currState: any;
    public startState: any;
    public stageOneState: any;
    public stageTwoState: any;
    public pausedState: any;
    public loseState: any;
    public endState: any;
    public interactablesManager!: InteractablesManager;
    public interactablesFactory!: InteractablesFactory;
    public htmlHandlers!: HTMLHandlers;
    public mapGenerator!: MapGenerator;
    public cheatCodeManager!: CheatCodeManager;
    public inputManager!: InputManager;
    public camera!: Camera;
    public particlesManager!: ParticlesManager;
    public particlesFactory!: ParticlesFactory;
    public hudManager!: HUDManager;
    private _HUD!: CanvasRenderingContext2D;

    constructor() {
        this.stage = 1;
        this.showFPS = false;
        this.fpsShowCounter = 0;
        this.fps = 60;
        this.loading = false;
        this.width = GameSettings.game.SCREEN_WIDTH;
        this.height = GameSettings.game.SCREEN_HEIGHT;
        this.objects = new Map();
        this.coins = [];
        this.elevators = [];
        this.elevator = null;
        this.backgroundOpacity = 1;
        this.coinCount = 0;
        this.currState = new GameBaseState();
        this.startState = new GameStartState();
        this.stageOneState = new GameStageOneState();
        this.stageTwoState = new GameStageTwoState();
        this.pausedState = new GamePausedState();
        this.loseState = new GameLoseState();
        this.endState = new GameEndState();
    }

    static get renderCollider(): boolean {
        return this._renderCollider;
    }

    static set renderCollider(value: boolean) {
        this._renderCollider = value;
    }

    static get deltaTime(): number {
        return this._deltaTime;
    }

    static set deltaTime(value: number) {
        this._deltaTime = value;
    }

    static get movementDeltaTime(): number {
        return this._movementDeltaTime;
    }

    static set movementDeltaTime(value: number) {
        this._movementDeltaTime = value;
    }

    static get debug(): boolean {
        return this._debug;
    }

    static set debug(value: boolean) {
        this._debug = value;
    }

    get HUD(): CanvasRenderingContext2D {
        return this._HUD;
    }

    set HUD(value: CanvasRenderingContext2D) {
        this._HUD = value;
    }

    static getInstance() {
        if (Game.instance == null) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    changeState() {
        this.objects.clear();
        this.ctx!.fillStyle = '#000000';
        this.ctx!.fillRect(0, 0, this.canvas!.width, this.canvas!.height * 2);
    }

    async init() {
        this.stage = 1;
        this.showFPS = false;
        this.fpsShowCounter = 0;
        this.fps = 60;
        this.loading = false;
        this.width = GameSettings.game.SCREEN_WIDTH;
        this.height = GameSettings.game.SCREEN_HEIGHT;
        this.objects = new Map();
        this.coins = [];
        this.elevators = [];
        this.elevator = null;
        this.backgroundOpacity = 1;
        this.coinCount = 0;
        this.camera = new Camera(this);
        this.inputManager = new InputManager(this);
        this.player = new Player(this.inputManager.inputObservable);
        this.enemyManager = new EnemyManager(this);
        this.interactablesManager = new InteractablesManager(this);
        this.interactablesFactory = this.interactablesManager.interactablesFactory;
        this.cheatCodeManager = new CheatCodeManager(this, this.inputManager.inputObservable);
        this.mapGenerator = new MapGenerator(this);
        this.particlesManager = new ParticlesManager();
        this.particlesFactory = this.particlesManager.particleFactory;
        this.hudManager = new HUDManager(this);
        this.htmlHandlers = new HTMLHandlers(this);
        AssetManager.setHTMLHandler(this.htmlHandlers!);
        GunHelper.setEnemyManager(this.enemyManager!);

        this.eventHandler();
    }

    async playGame() {
        this.loading = true;
        this.particlesManager!.clear();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await this.switchState(this.stageOneState);
        this.loading = false;
    }

    prepareCanvas() {
        const canvas = document.getElementById('game') as HTMLCanvasElement;
        this.canvas = canvas;

        this.ctx = canvas.getContext('2d')!;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        DrawHelper.setDefaultContext(this.ctx!);

        this._HUD = (document.getElementById('HUD') as HTMLCanvasElement).getContext('2d')!;
        this._HUD.setTransform(1, 0, 0, 1, 0, 0);
        this.configCanvas();
    }

    configCanvas() {
        this.ctx!.imageSmoothingEnabled = false;
        this.ctx!.scale(GameSettings.game.GAME_SCALE, GameSettings.game.GAME_SCALE);

        this._HUD!.imageSmoothingEnabled = false;
        this._HUD!.scale(GameSettings.game.GAME_SCALE, GameSettings.game.GAME_SCALE);
    }

    async switchState(nextState: GameBaseState) {
        await this.currState.exitState(this);
        this.currState = nextState;
        await this.currState.enterState(this);
    }

    update(deltaTime: number) {
        Game.deltaTime = deltaTime * GameSettings.GAME.GAME_SPEED;
        Game.movementDeltaTime = Math.cbrt(deltaTime * GameSettings.GAME.GAME_SPEED);
        if (this.loading) {
            return;
        }
        this.currState.updateState(this);
        this.fpsHandler();
    }

    toggleFullscreen(state: boolean) {
        if (state) {
            document.documentElement.requestFullscreen().then();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then(); // Standard
            }
        }
    }

    unpauseGame() {
        if (this.stage === 1) {
            this.currState.exitState(this);
            this.currState = this.stageOneState;
        } else if (this.stage === 2) {
            this.currState.exitState(this);
            this.currState = this.stageTwoState;
        }
    }

    fpsHandler() {
        if (!this.showFPS) {
            return;
        }

        this.fpsShowCounter += Game.deltaTime;
        if (this.fpsShowCounter > 5) {
            this.fpsShowCounter = 0;
            this.fps = Math.round(60 / Game.deltaTime);
        }

        this._HUD!.font = '25px Arial';
        this._HUD!.fillStyle = 'white';
        this._HUD!.textAlign = 'right';
        this._HUD!.fillText(String(this.fps), GameSettings.GAME.SCREEN_WIDTH / 2 - 5, 25);
    }

    drawHUD() {
        this.hudManager.drawHUD();

        if (this.player!.immunity >= 30) {
            return;
        }

        this.setTransparency(Math.sin(Math.abs(this.player!.immunity - 30) / 30));

        const damageUI = AssetManager.getImage('damaged_ui');
        this.ctx!.drawImage(damageUI, this.camera!.position.x, this.camera!.position.y, damageUI.width * GameSettings.GAME.GAME_SCALE, damageUI.height * GameSettings.GAME.GAME_SCALE);

        this.setTransparency(1);
    }

    darkenBackground(darken = 0.05) {
        this.backgroundOpacity -= darken;
        if (this.backgroundOpacity < darken) {
            this.backgroundOpacity = 0;
        }
    }

    brightenBackground(brighten = 0.05) {
        this.backgroundOpacity += brighten;
        if (this.backgroundOpacity > 1) {
            this.backgroundOpacity = 1;
        }
    }

    setTransparency(transparency: number, canvas = this.ctx) {
        if (transparency < 0) {
            transparency = 0;
        }
        canvas!.globalAlpha = transparency;
    }

    setFilter(filter: string) {
        this.ctx!.filter = filter;
    }

    private eventHandler = () =>
        this.inputManager.inputObservable.subscribe(({ event, data }) => {
            if (event === 'keydown') {
                if (data === 'p' && (this.currState === this.stageTwoState || this.currState === this.stageOneState)) {
                    this.switchState(this.pausedState).then();
                }
            }
        });
}
