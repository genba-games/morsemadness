import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor(game, x, y, asset) {
    super(game, x, y, asset)

    game.physics.arcade.enable(this);

  }
  /**
   * Defines collision logic for this object.
   * @param {Phaser.Sprite} target Object colliding with this object.
   */
  collide(target) { };
}

