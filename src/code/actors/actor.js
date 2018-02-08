import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor(game, x, y, asset) {
    super(game, x, y, asset)

    game.physics.arcade.enable(this);

    this.controllerEnabled = true;
  }

  disableController () {
    this.controllerEnabled = false;
  }

  enableController () {
    this.controllerEnabled = true;
  }

  stop () {
    this.disableController();
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }

  start () {
    this.enableController();
  }

  swapGamepads(swapee) {
    // cover your eyes, don't let this shiny es6 loc blind you 😎
    [this.gamepad, swapee.gamepad] = [swapee.gamepad, this.gamepad]
    this.disableController()
  }
  
  /**
   * Defines collision logic for this object.
   * @param {Phaser.Sprite} target Object colliding with this object.
   */
  collide(target) { };
}
