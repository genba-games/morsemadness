import Phaser from 'phaser'
import Actor from './actor'
import { Gamepad, GAMEPAD_KEY } from '../gamepad/gamepad'

export default class extends Actor {
  constructor ({ game, x, y, asset, keymap, gamepad }) {
    super(game, x, y, asset)
    
    this.gamepad = new Gamepad(this, keymap, gamepad);

    // Enable physics
    game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    
    this.animations.add('left', [2], 1, true)
    this.animations.add('right', [1], 1, true)
    this.animations.add('down', [0], 1, true)
    this.animations.add('up', [3], 1, true)
    this.animations.add(
        'twist', 
        [0, 1, 3, 2, 0, 1, 3, 2, 0, 1, 1, 3, 3, 2, 2, 0, 0, 1, 1, 1, 3, 3, 3, 2, 2, 2, 0, 0, 0],
        25, 
        false,
    )
    this.animations.add(
        'death', 
        [1, 3, 2, 0, 1, 3, 2, 0, 1, 3, 2, 0, 1, 3, 2, 0],
        25,
        false,
    ).onComplete.add(this.kill);

    this.canMove = true;
    
    // Movement speed
    this.speed = 90;
  }

  collide(target) {
    if (this.canMove) {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.canMove = false;
        this.play('death');
    }
  }

  kill() {
      super.kill()
  }

  update() {
    if (this.canMove) {
        if (this.gamepad.keyPressed(GAMEPAD_KEY.UP)
        || (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_1)) == -1)
        {
            this.body.velocity.y = -this.speed;
            this.animations.play('up')
        }
        else if (this.gamepad.keyPressed(GAMEPAD_KEY.DOWN)
        ||  (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_1)) == 1)
        {
            this.body.velocity.y = this.speed;
            this.animations.play('down')
            
        }
        else this.body.velocity.y = 0;

        if (this.gamepad.keyPressed(GAMEPAD_KEY.LEFT)
        || (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_0)) == -1)
        {
            this.body.velocity.x = -this.speed;
            this.animations.play('left')
            
        }
        else if (this.gamepad.keyPressed(GAMEPAD_KEY.RIGHT)
        || (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_0)) == 1)
        {
            this.body.velocity.x = this.speed;
            this.animations.play('right')
        }
        else this.body.velocity.x = 0;
    }
  }
}