import Actor from './actor'
export default class extends Actor {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.status = {
            stun: false,
            controllerEnabled: true
        }
        this.stunSprite = new Phaser.Sprite(game, 0, 0, 'stun')
        this.stunSprite.animations.add('stun', [1, 2, 3, 4], 10, true)
        this.addChild(this.stunSprite)
        this.stunSprite.frame = 0
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
            this.stunSprite.animations.play('stun')
        } else if (this.status.stun) {
            this.toggleController()
            this.toggleStun()
            this.stunSprite.animations.stop()
            this.stunSprite.frame = 0
        }
    }

    toggleController() {
        this.status.controllerEnabled = !this.status.controllerEnabled
    }
    update() {
        //if im stunned change my animation to stunned. not sure if i should do this here or back there.
    }
}