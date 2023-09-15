import Player from '../player/Player.js';
import playerInput from '../../helper/player/playerInput.js';
import { get_image } from '../../helper/fileReader.js';
import Camera from '../camera/Camera.js';
import firefliesSpawner from '../../helper/renderer/firefliesSpawner.js';
import hudHandler from '../../ui/hudHandler.js';
import {firstStage, secondStage} from '../../helper/stages/stageHandler.js';
import GameSettings from '../../constants.js';
import EnemyManager from "../enemy/EnemyManager.js";
import GameStartState from "./state/GameStartState.js";
import GameStageOneState from "./state/GameStageOneState.js";
import GameStageTwoState from "./state/GameStageTwoState.js";
import GamePausedState from "./state/GamePausedState.js";
import GameBaseState from "./state/GameBaseState.js";
import AudioPlayer from "../../../audio/AudioPlayer.js";

export default class Game {
    static instance = null;
    constructor() {
        this.stage = 1;
        this.paused = false;
        this.loading = false;
        this.player = new Player();
        this.width = GameSettings.game.SCREEN_WIDTH;
        this.height = GameSettings.game.SCREEN_HEIGHT;
        this.keys = [];
        this.clicks = [];
        this.collideables = [];
        this.renderList = [];
        this.boss = null;
        this.bossEntities = [];
        this.canvas = null;
        this.ctx = null;
        this.debug = false;
        this.backgroundOpacity = 1;
        this.elevator = null;
        this.audio = AudioPlayer.getInstance();
        this.currState = new GameBaseState();
        this.startState = new GameStartState();
        this.stageOneState = new GameStageOneState();
        this.stageTwoState = new GameStageTwoState();
        this.pausedState = new GamePausedState();
    }

    async init() {
        this.prepareCanvas();
        playerInput();
        this.camera = new Camera();

        // await secondStage({
        //     game: this,
        // });

        await this.switchState(this.stageOneState);
    }

    static getInstance() {
        if (Game.instance == null) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    async playGame(outfitNumber) {

        if(outfitNumber === 1) {
            this.player.outfit = 'dark';
        }
        if(outfitNumber === 2) {
            this.player.outfit = 'yellow';
        }

        this.loading = true;
        await this.switchState(this.stageOneState);
        this.loading = false;
    }

    prepareCanvas() {
        const canvas = document.getElementById('game');
        this.canvas = canvas;

        const ctx = canvas.getContext('2d');
        this.ctx = ctx;
        this.player.canvas = ctx;

        this.HUD = document.getElementById('HUD').getContext('2d');
        this.configCanvas();
        // Trader.generate({ x: 800, y: 1500, collideable: true }); TODO
    }

    configCanvas() {
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.scale(GameSettings.game.GAME_SCALE, GameSettings.game.GAME_SCALE);

        this.HUD.imageSmoothingEnabled = false;
        this.HUD.scale(GameSettings.game.GAME_SCALE, GameSettings.game.GAME_SCALE);
    }

    async switchState(nextState) {
        await this.currState.exitState(this);
        this.currState = nextState;
        await this.currState.enterState(this);
    }

    updateGame() {
        if(this.loading) {
            return;
        }
        this.currState.updateState(this);
    }

    drawHUD() {
        hudHandler({
            HUD: this.HUD,
            player: this.player,
        });

        if (this.player.immunity >= 30) {
            return;
        }

        this.setTransparency(Math.sin(Math.abs(this.player.immunity - 30) / 30));

        get_image('UI', 'damaged', null, (img) => {
            Game.getInstance().HUD.drawImage(img, 0, 0, img.width * GameSettings.GAME.GAME_SCALE, img.height * GameSettings.GAME.GAME_SCALE);
        });

        this.setTransparency(1);
    }

    enemySpawnHandler() {

    }

    darkenBackground() {
        this.backgroundOpacity -= 0.05;
        if (this.backgroundOpacity < 0.05) {
            this.backgroundOpacity = 0;
        }
    }

    brightenBackground() {
        this.backgroundOpacity += 0.05;
        if(this.backgroundOpacity > 1) {
            this.backgroundOpacity = 1;
        }
    }

    setTransparency(transparency) {
        this.ctx.globalAlpha = transparency;
    }

    setFilter(filter) {
        this.ctx.filter = filter;
    }

}
