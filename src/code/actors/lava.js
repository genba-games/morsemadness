import Phaser from 'phaser'

export default class Signal extends Phaser.TileSprite {
    constructor (game, x, y, width, height, speed) {
      super(game, x, y, width, height, 'lava');

      this.game.physics.arcade.enable(this);

      this.animations.add('glow', [0, 1, 2, 1], 6, true);
      this.play('glow');

      // Lava speed
      this.speed = speed || 9;
    }

    /**
     * Makes lava start moving.
     */
    start() {
      this.body.velocity.x = this.speed;
    }
    
    /** 
     * Stops lava from moving 
     */ 
    stop() {
      this.body.velocity.x = 0;
    }
  }