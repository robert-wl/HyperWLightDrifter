import Tree from './Tree.js';
import Game from '../../Game/Game.js';

export default class SetPieceGenerator {
    static generate({ x, y }) {
        Game.getInstance().objects.set(`${x},${y}`, new Tree(x, y));
    }
}
