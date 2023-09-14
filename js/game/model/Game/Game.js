import Player from '../player/Player.js';
import playerInput from '../../helper/player/playerInput.js';
import { get_image } from '../../helper/fileReader.js';
import Camera from '../camera/Camera.js';
import firefliesSpawner from '../../helper/renderer/firefliesSpawner.js';
import hudHandler from '../../helper/renderer/hudHandler.js';
import {firstStage, secondStage} from '../../helper/stages/stageHandler.js';
import GameSettings from '../../constants.js';
import EnemyManager from "../enemy/EnemyManager.js";

export default class Game {
    static instance = null;
    constructor() {
        this.stage = 1;
        this.paused = false;
        this.player = new Player();
        this.width = GameSettings.game.SCREEN_WIDTH;
        this.height = GameSettings.game.SCREEN_HEIGHT;
        this.keys = [];
        this.clicks = [];
        this.collideables = [];
        this.particles = [];
        this.renderList = [];
        this.boss = null;
        this.bossEntities = [];
        this.canvas = null;
        this.ctx = null;
        this.debug = false;
        this.backgroundOpacity = 1;
        this.elevator = null;
    }

    async init() {
        this.prepareCanvas();
        playerInput();
        this.camera = new Camera();
        //
        // await secondStage({
        //     game: this,
        // });

        await firstStage();

        this.camera.setCameraPosition({
            position: this.player.centerPosition,
        });

    }

    static getInstance() {
        if (Game.instance == null) {
            Game.instance = new Game();
        }
        return Game.instance;
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

    updateGame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.camera.shakeCamera();
        this.camera.renderLowerBackground();
        this.enemySpawnHandler();

        if (this.stage === 1) {
            firefliesSpawner();
        }

        this.setTransparency(this.backgroundOpacity);
        this.setTransparency(1);

        EnemyManager.getInstance().update();

        this.collideables.forEach((collideable) => collideable.update());


        this.player.updateState();

        this.camera.renderTopBackground();

        this.particles.forEach((particle) => particle.update());

        this.boss?.update();
        this.bossEntities?.forEach((entity) => entity.update());

        this.elevator?.update();

        this.drawHUD();

        this.camera.resetShakeCamera();
        this.camera.updateCamera();

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
