import Game from '../../game/Game.js';
import AssetManager from './AssetManager.js';

export default class HUDManager {
    private game: Game;
    private readonly HUD: CanvasRenderingContext2D;

    public constructor(game: Game) {
        this.game = game;
        this.HUD = game.HUD;
    }

    public clearHUD() {
        this.HUD.clearRect(0, 0, this.HUD.canvas.width, this.HUD.canvas.height);
    }

    public drawHUD() {
        if (!this.HUD) {
            return;
        }

        this.HUD.clearRect(0, 0, this.HUD.canvas.width, this.HUD.canvas.height);

        this.HUD.fillStyle = 'rgb(100, 100, 100)';
        this.HUD.fillRect(2, 30, 15, 4);
        this.HUD.fillStyle = 'lightgreen';
        this.HUD.fillRect(2, 30, (Math.min(this.game.player.healthPack, 3) / 3) * 15, 4);

        this.HUD.fillStyle = 'rgb(100, 100, 100)';
        this.HUD.fillRect(2, 4, 130, 2);
        this.HUD.fillStyle = 'white';
        this.HUD.fillRect(2, 4, ((this.game.player.stamina % 101) / 10) * 13, 2);

        this.HUD.fillStyle = 'rgb(100, 100, 100)';
        this.HUD.fillRect(24, 30, 15, 4);
        this.HUD.fillStyle = 'white';
        this.HUD.fillRect(24, 30, (Math.min(this.game.player.bombs, 2) / 2) * 15, 4);

        const width = [0, 15, 27, 42, 57, 72];

        this.HUD.fillStyle = 'rgb(100, 100, 100)';
        this.HUD.fillRect(45, 12, 86, 10);
        for (let i = 0; i < this.game.player.maxHealth; i++) {
            if (i < this.game.player.health) {
                this.HUD.fillStyle = 'lightgreen';
                this.HUD.fillRect(45 + width[i], 12, 15, 10);
            }
        }

        this.HUD.fillStyle = 'rgb(100, 100, 100)';
        this.HUD.fillRect(45, 25, 86, 10);
        this.HUD.fillStyle = 'rgb(250, 75, 75)';
        this.HUD.fillRect(45, 25, ((this.game.player.bullets % 4) / 3) * 87, 10);

        const HUDImage = AssetManager.getImage('HUD');

        this.HUD.drawImage(HUDImage, 0, 0, HUDImage.width * 1.5, HUDImage.height * 1.5);

        this.HUD.font = 'bold 25px Courier New';
        this.HUD.fillStyle = '#ffb733';
        this.HUD.textAlign = 'start';
        this.HUD.fillText('' + this.game.coinCount, 25, 60);
    }
}
