import Player from './player/Player.js';
import playerInput from '../helper/player/playerInput.js';
import { get_image } from '../helper/fileReader.js';
import Camera from './camera/Camera.js';
import stageOneHandler from '../stage/stageOneHandler.js';
import firefliesSpawner from './particles/firefliesSpawner.js';
import CrystalBrute from './enemy/crystalBrute/CrystalBrute.js';
import Trader from './collideable/Trader.js';
import CrystalSpider from './enemy/crystalSpider/CrystalSpider.js';
import hudHandler from '../helper/player/hudHandler.js';

export const GAME_SCALE = 2;

export default class Game {
    static instance = null;
    constructor() {
        this.stage = 1;
        this.paused = false;
        this.player = new Player();
        this.width = 1920;
        this.height = 1080;
        this.keys = [];
        this.clicks = [];
        this.collideable = [];
        this.particles = [];
        this.renderList = [];
        this.enemyList = [];
        this.canvas = null;
        this.canvasCtx = null;
        this.debug = false;
    }

    init() {
        this.prepareCanvas();
        playerInput();
        this.firstStage();
        this.camera = new Camera();
        this.camera.setPosition({
            position: this.player.position,
            canvas: this.canvasCtx,
        });
        stageOneHandler();
        CrystalSpider.generate({ x: 1000, y: 800 });
        CrystalBrute.generate({ x: 1000, y: 800 });
    }

    static getInstance() {
        if (Game.instance == null) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    prepareCanvas() {
        const canvas = document.getElementById('myCanvas');
        this.canvas = canvas;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.scale(GAME_SCALE, GAME_SCALE);
        this.canvasCtx = ctx;
        this.player.canvas = ctx;

        const HUD = document.getElementById('HUD');
        this.HUD = HUD.getContext('2d');
        this.HUD.imageSmoothingEnabled = false;
        this.HUD.scale(GAME_SCALE, GAME_SCALE);

        Trader.generate({ x: 800, y: 1500, collideable: true });
    }

    updateGame() {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        firefliesSpawner();

        this.camera.updateCamera();

        for (const enemy of this.enemyList) {
            enemy.update();
        }

        this.player.updateState();

        for (const render of this.renderList) {
            render.update();
        }

        this.camera.renderTopBackground();

        for (const particle of this.particles) {
            particle.update();
        }
        for (const c of this.collideable) {
            c.update();
        }

        this.drawHUD();
    }

    drawHUD() {
        hudHandler({
            HUD: this.HUD,
            player: this.player,
        });

        if (this.player.immunity < 30) {
            const HUD = this.HUD;
            HUD.globalAlpha = Math.sin(Math.abs(this.player.immunity - 30) / 30);
            get_image('UI', 'damaged', null, (img) => {
                Game.getInstance().HUD.drawImage(
                    img,
                    0,
                    0,
                    img.width * 2,
                    img.height * 2
                );
            });
            HUD.globalAlpha = 1;
        }
    }

    firstStage() {
        get_image('world', 'map_ground', null, function (img) {
            Game.getInstance().camera.lowerBackground = img;
        });
        get_image('world', 'first_map_full', null, function (img) {
            Game.getInstance().camera.topBackground = img;
        });
        this.player.position.x = 900;
        this.player.position.y = 400;
    }
}
