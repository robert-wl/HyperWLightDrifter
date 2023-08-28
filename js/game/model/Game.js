import Player from './player/Player.js';
import playerInput from '../helper/input.js';
import { get_image } from '../helper/fileReader.js';
import Camera from './camera/Camera.js';
import stageOneHandler from "../stage/stageOneHandler.js";

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
        this.canvas = null;
        this.canvasCtx = null;
        this.debug = true;
    }

    init() {
        this.prepareCanvas();
        playerInput();
        this.firstStage();
        this.camera = new Camera();
        this.camera.setPosition({
            position: this.player.position,
            canvas: this.canvasCtx
        });
        stageOneHandler();
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
    }

    updateGame() {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.camera.updateCamera();
        this.player.updateState();

        if(this.debug) {
            for(const c of this.collideable) {
                c.renderDebug();
            }
        }
    }

    firstStage() {
        get_image('world', 'enemy_room', null, function (img) {
            Game.getInstance().camera.background = img;
        });
        this.player.position.x = 900;
        this.player.position.y = 1200;
    }
}
