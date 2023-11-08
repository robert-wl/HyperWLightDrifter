import { Vector } from './Vector';

export interface DashData {
    currPosition: Vector;
    animationStage: number;
    angle: number;
    lastPosition: Vector;
    direction: string;
}
