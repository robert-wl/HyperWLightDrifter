import CameraBaseState from './CameraBaseState.js';
import Camera from '../Camera';

export default class CameraFollowState extends CameraBaseState {
    public updateState(camera: Camera) {
        camera.moveCamera();

        camera.cameraBox.update();
    }

    public enterState(): void {}

    public exitState(): void {}
}
