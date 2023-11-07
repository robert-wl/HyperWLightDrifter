import Collider from '../../collideable/Collider.js';
import Elevator from '../../interactables/Elevator/Elevator.js';
import Medkit from '../../interactables/Medkit.js';

export interface Piece {
    image: HTMLImageElement;
    position: Position;
    flipped: boolean;
    collider: Collider;
}

export type CombinedPiece = Piece | Elevator | Medkit;
