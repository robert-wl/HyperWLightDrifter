import Player from './player/Player.js';
import playerInput from '../helper/player/playerInput.js';
import { get_image } from '../helper/fileReader.js';
import Camera from './camera/Camera.js';
import firefliesSpawner from './particles/firefliesSpawner.js';
import CrystalBrute from './enemy/crystalBrute/CrystalBrute.js';
import CrystalSpider from './enemy/crystalSpider/CrystalSpider.js';
import hudHandler from '../helper/renderer/hudHandler.js';
import { firstStage, secondStage } from '../helper/stages/stageHandler.js';

export const GAME_SCALE = 2;
export const SCREEN_WIDTH = 1920;
export const SCREEN_HEIGHT = 1080;

export default class Game {
    static instance = null;
    constructor() {
        this.stage = 1;
        this.paused = false;
        this.player = new Player();
        this.width = SCREEN_WIDTH;
        this.height = SCREEN_HEIGHT;
        this.keys = [];
        this.clicks = [];
        this.collideable = [];
        this.particles = [];
        this.renderList = [];
        this.enemyList = [];
        this.boss = null;
        this.bossEntities = [];
        this.canvas = null;
        this.canvasCtx = null;
        this.debug = false;
        this.enemySpawn = true;
        this.enemyCount = 0;
        this.difficulty = 1;
        this.backgroundOpacity = 1;
    }

    init() {
        this.prepareCanvas();
        playerInput();
        this.camera = new Camera();
        secondStage({
            game: this,
        });
        this.camera.setPosition({
            position: this.player.position,
            canvas: this.canvasCtx,
        });
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

        // Trader.generate({ x: 800, y: 1500, collideable: true });
    }

    updateGame() {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.enemySpawnHandler();

        if (this.stage === 1 && false) {
            firefliesSpawner();
        }

        this.canvasCtx.globalAlpha = this.backgroundOpacity;
        this.camera.updateCamera();
        this.canvasCtx.globalAlpha = 1;

        for (const enemy of this.enemyList) {
            enemy.update();
        }

        for (const c of this.collideable) {
            c.update();
        }

        this.player.updateState();

        this.camera.renderTopBackground();

        for (const particle of this.particles) {
            particle.update();
        }

        if (this.boss) {
            this.boss.update();

            for (const entity of this.bossEntities) {
                entity.update();
            }
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
                Game.getInstance().HUD.drawImage(img, 0, 0, img.width * 2, img.height * 2);
            });
            HUD.globalAlpha = 1;
        }
    }

    enemySpawnHandler() {
        if (!this.enemySpawn) {
            return;
        }
        // const coordinates = [
        //     { x: 200, y: 500 },
        //     { x: 1600, y: 500 },
        // ];
        if (this.enemyCount <= 0) {
            for (let i = 0; i <= this.difficulty; i++) {
                const radius = 1000 + Math.random() * 100;

                const angle = Math.random() * Math.PI * 2;

                if (this.difficulty > 5 && Math.random() > 0.75) {
                    CrystalBrute.generate({
                        x: SCREEN_WIDTH / 2 + (radius / 1.7) * Math.cos(angle),
                        y: SCREEN_HEIGHT / 2 + (radius / 1.7) * Math.sin(angle),
                    });
                    i += 5;
                    this.enemyCount += 5;
                    continue; //TODO NOT USE CONTINUE
                }
                CrystalSpider.generate({
                    x: SCREEN_WIDTH / 2 + radius * Math.cos(angle),
                    y: SCREEN_HEIGHT / 2 + radius * Math.sin(angle),
                });
                this.enemyCount++;
            }
            this.difficulty++;
        }
    }
}
