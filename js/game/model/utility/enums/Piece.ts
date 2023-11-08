import Collider from '../../collideable/Collider.js';
import Elevator from '../../interactables/Elevator/Elevator.js';
import Medkit from '../../interactables/Medkit.js';
import { Vector } from './Vector.js';
import Key from '../../interactables/Key.js';
import CrystalSpider from '../../enemy/crystalSpider/CrystalSpider.js';
import CrystalBrute from '../../enemy/crystalBrute/CrystalBrute.js';

export interface Piece {
    image: HTMLImageElement;
    position: Vector;
    flipped: boolean;
    collider: Collider | null;
}

export type CombinedPiece = Piece | Elevator | Medkit | Key | CrystalSpider | CrystalBrute;
