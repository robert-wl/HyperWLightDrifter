import Camera from '../Camera';

export default abstract class CameraBaseState {
    public abstract updateState(camera: Camera): void;

    public abstract enterState(camera: Camera): void;

    public abstract exitState(camera: Camera): void;
}
