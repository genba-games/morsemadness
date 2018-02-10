import Actor from './actor'
export default class extends Actor {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.white=this.game.add.filter('White')
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
        this.status.stun = !this.status.stun
    }
    stun() {
        if (!this.status.stun) {
            this.toggleController()
            this.toggleStun()
            game.time.events.add(Phaser.Timer.SECOND * 2, this.stun, this);
        } else if (this.status.stun) {
            this.toggleController()
            this.toggleStun()
        }
    }

    toggleController() {
        this.status.controllerEnabled = !this.status.controllerEnabled
    }
    update() {
        //if im stunned change my animation to stunned. not sure if i should do this here or back there.
    }
}