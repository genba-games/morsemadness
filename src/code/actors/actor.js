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

  swapGamepads() {
    if (this.gamepad.padId == 0) {
      this.gamepad.setGamepad(game.input.gamepad.pad2)
      this.gamepad.setKeymap(1)
    } else if (this.gamepad.padId == 1) {
      this.gamepad.setGamepad(game.input.gamepad.pad1)      
      this.gamepad.setKeymap(0)

    }
  }

  /**
   * Defines collision logic for this object.
   * @param {Phaser.Sprite} target Object colliding with this object.
   */
  collide(target) { };
}
