import Actor from './actor'
export default class extends Actor {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)

        this.status = {
            sprite: new Phaser.Sprite(game, 0, 0, 'status'),
            stun: false,
            controllerEnabled: true,
            streak: false
        }
        this.addChild(this.status.sprite)

        this.status.sprite.animations.add('stun', [1, 2, 3, 4], 10, true)
        this.status.sprite.frame = 0
    }

    toggleStun() {
        this.status.stun = !this.status.stun
    }
    toggleController() {
        this.status.controllerEnabled = !this.status.controllerEnabled
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
    stun() {
        if (!this.status.stun) {
            game.time.events.add(Phaser.Timer.SECOND * 2, this.stun, this);
            this.status.sprite.animations.play('stun')
        } else if (this.status.stun) {
            this.status.sprite.animations.stop()
            this.status.sprite.frame = 0
        }
        this.toggleController()
        this.toggleStun()
    }
}