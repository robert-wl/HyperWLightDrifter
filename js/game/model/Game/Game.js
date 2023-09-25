import Player from '../player/Player.js';
import playerInput from '../../helper/player/playerInput.js';
import { get_image } from '../../helper/fileReader.js';
import Camera from '../camera/Camera.js';
import hudHandler from '../../ui/hudHandler.js';
import GameSettings from '../../constants.js';
import EnemyManager from '../enemy/EnemyManager.js';
import GameStartState from './state/GameStartState.js';
import GameStageOneState from './state/GameStageOneState.js';
import GameStageTwoState from './state/GameStageTwoState.js';
import GamePausedState from './state/GamePausedState.js';
import GameBaseState from './state/GameBaseState.js';
import AudioPlayer from '../../../audio/AudioPlayer.js';
import GameLoseState from './state/GameLoseState.js';

export default class Game {
    static instance = null;

    constructor() {
        this.stage = 1;
        this.deltaTime = 0;
        this.movementDeltaTime = 0;
        this.showFPS = false;
        this.fullscreenData = {};
        this.fullscreen = false;
        this.loading = false;
        this.player = null;
        this.width = GameSettings.game.SCREEN_WIDTH;
        this.height = GameSettings.game.SCREEN_HEIGHT;
        this.keys = [];
        this.clicks = [];
        this.collideables = [];
        this.elevator = null;
        this.enemyManager = null;
        this.canvas = null;
        this.ctx = null;
        this.debug = true;
        this.backgroundOpacity = 1;
        this.elevator = null;
        this.audio = AudioPlayer.getInstance();
        this.currState = new GameBaseState();
        this.startState = new GameStartState();
        this.stageOneState = new GameStageOneState();
        this.stageTwoState = new GameStageTwoState();
        this.pausedState = new GamePausedState();
        this.loseState = new GameLoseState();
    }

    static getInstance() {
        if (Game.instance == null) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    changeState() {
        this.enemyManager.enemyList = [];
        this.collideables = [];
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 2);
    }

    async init() {
        playerInput();
        this.camera = new Camera();
        this.enemyManager = new EnemyManager();
        this.player = new Player();

        this.player.init();

        // await secondStage({
        //     game: this,
        // });

        //
    }

    async playGame(outfitNumber) {
        console.log('hello');
        if (outfitNumber === 1) {
            this.player.outfit = 'dark';
        }
        if (outfitNumber === 2) {
            this.player.outfit = 'yellow';
        }

        this.loading = true;
        await this.switchState(this.stageOneState);
        this.loading = false;
    }

    prepareCanvas() {
        const canvas = document.getElementById('game');
        this.canvas = canvas;

        this.ctx = canvas.getContext('2d');
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        this.HUD = document.getElementById('HUD').getContext('2d');
        this.HUD.setTransform(1, 0, 0, 1, 0, 0);
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

    update(deltaTime) {
        this.deltaTime = deltaTime * GameSettings.GAME.GAME_SPEED;
        this.movementDeltaTime = Math.cbrt(deltaTime * GameSettings.GAME.GAME_SPEED);
        
        if (this.loading) {
            return;
        }
        this.currState.updateState(this);
    }

    toggleFullscreen() {
        // this.fullscreen = !this.fullscreen;
        // if(this.fullscreenData === {}) {
        //     this.fullscreenData = {
        //         game: $('#game').css(),
        //         HUD: $('#HUD').css(),
        //     }
        // }
        // if(this.fullscreen) {
        //     const game = $('#game');
        //     const HUD = $('.ui');
        //
        //
        //     game
        //         .css('max-width', '100vw')
        //         .css('height', '100vh');
        //
        //     HUD
        //         .css('max-width', '100vw')
        //         .css('height', '100vh');
        // }
        // else {
        //     document.exitFullscreen();
        // }
    }

    pauseHandler() {
        if (this.keys.includes('escape')) {
            this.switchState(this.pausedState);
        }
    }

    unpauseGame() {
        this.keys = [];
        this.clicks = [];
        if (this.stage === 1) {
            this.currState.exitState(this);
            this.currState = this.stageOneState;
        } else if (this.stage === 2) {
            this.currState.exitState(this);
            this.currState = this.stageTwoState;
        }
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

    setTransparency(transparency, canvas = this.ctx) {
        if (transparency < 0) {
            transparency = 0;
        }
        canvas.globalAlpha = transparency;
    }

    setFilter(filter) {
        this.ctx.filter = filter;
    }
}
