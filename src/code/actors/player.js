import Actor from './actor'
export default class extends Actor {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)

        this.status = {
            stun: false,
            controllerEnabled: true
        }
    }

    disableController() {
        this.status.controllerEnabled = false;
    }

    enableController() {
        this.status.controllerEnabled = true;
    }

    stop() {
        this.disableController();
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    start() {
        this.enableController();
    }

    swapGamepads(swapee) {
        // cover your eyes, don't let this shiny es6 loc blind you 😎
        [this.gamepad, swapee.gamepad] = [swapee.gamepad, this.gamepad]
    }
    toggleStun() {
        if (this.status.stun === false) {
            this.toggleController()
            game.time.events.add(Phaser.Timer.SECOND * 2, this.toggleStun, this);
        } else {
            this.toggleController()
            this.status.stun = !this.status.stun
        }
    }
    toggleController() {
        this.status.controllerEnabled = !this.status.controllerEnabled
    }
}