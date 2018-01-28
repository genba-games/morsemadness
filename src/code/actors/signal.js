import Phaser from 'phaser'
import Actor from './actor'

export default class Signal extends Actor {
  constructor (game, x, y, asset) {
    super(game, x, y, asset)
  }

  /**
   * Defines collision logic for this object.
   * @param {Phaser.Sprite} target Object colliding with this object.
   */
  collide (target) {};
}