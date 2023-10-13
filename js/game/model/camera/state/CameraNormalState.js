import CameraBaseState from './CameraBaseState.js';

export default class CameraNormalState extends CameraBaseState {
    enterState(camera) {
        super.enterState(camera);
    }

    updateState(camera) {
        camera.moveCamera();

        camera.cameraBox.update();

        // if (this.snapBackToPlayer) {
        //     this.moveCameraPosition({
        //         direction: {
        //             x: (player.centerPosition.x - this.position.x) * 0.05,
        //             y: (player.centerPosition.y - this.position.y) * 0.05,
        //         },
        //     });
        //
        //     const distance = getMagnitudeValue({
        //         x: player.centerPosition.x - this.position.x,
        //         y: player.centerPosition.y - this.position.y,
        //     });
        //
        //     if (distance < 600) {
        //         this.snapBackToPlayer = false;
        //     }
        // }
    }

    exitState(camera) {
        super.exitState(camera);
    }

    renderLowerLayer(camera) {
        super.renderLowerLayer(camera);
    }

    renderUpperLayer(camera) {
        super.renderUpperLayer(camera);
    }
}
