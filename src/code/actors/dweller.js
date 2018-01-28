import Phaser from 'phaser'
import { Gamepad, GAMEPAD_KEY } from '../gamepad/gamepad'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, keymap, gamepad }) {
    super(game, x, y, asset)
    
    this.gamepad = new Gamepad(this, keymap, gamepad);

    // Enable physics
    game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;

    this.aIdle = this.animations.add('idle')
    this.animations.add('idle', [0, 1, 2, 3], 2, true)
    
    this.aLeft = this.animations.add('left')
    this.animations.add('left', [2], 1, true)
    
    this.aRight = this.animations.add('right')
    this.animations.add('right', [1], 1, true)
    
    this.aDown = this.animations.add('down')
    this.animations.add('down', [0], 1, true)
    
    this.aUp = this.animations.add('up')
    this.animations.add('up', [3], 1, true)
    
    this.speed = 90;
  }

  update(){
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
    
    if (this.gamepad.keyPressed(GAMEPAD_KEY.ACTION)){
        this.height++;
    }
    if (this.gamepad.keyPressed(GAMEPAD_KEY.INTERACT)){
        this.height--;
    }
  }
}