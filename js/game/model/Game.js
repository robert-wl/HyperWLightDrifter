import Player from './player/Player.js';
import playerInput from '../helper/playerInput.js';
import { get_image } from '../helper/fileReader.js';
import Camera from './camera/Camera.js';
import stageOneHandler from '../stage/stageOneHandler.js';
import firefliesSpawner from "./particles/firefliesSpawner.js";
import CrystalBrute from "./enemy/crystalBrute/CrystalBrute.js";
import Door from "./collideable/Door.js";
import Trader from "./collideable/Trader.js";
import CrystalSpider from "./enemy/crystalSpider/CrystalSpider.js";

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
        Trader.generate({x: 800, y: 1500, collideable: true});
    }

    updateGame() {
        firefliesSpawner();
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.camera.updateCamera();
        for (const enemy of this.enemyList) {
            enemy.update();
        }

        this.player.updateState();

        for (const render of this.renderList) {
            render.update();
        }
        this.camera.renderTopBackground();

        for(const particle of this.particles){
            particle.update();
        }
        for (const c of this.collideable) {
            c.update();
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
