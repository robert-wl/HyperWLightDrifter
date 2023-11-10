import { Vector } from './Vector.js';

export interface PlayerDashData {
    currPosition: Vector;
    animationStage: number;
    angle: number;
    lastPosition: Vector;
    direction: string;
}
