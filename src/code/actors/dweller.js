import Phaser from 'phaser'
import { Gamepad, GAMEPAD_KEY } from '../gamepad/gamepad'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, keymap, gamepad }) {
    super(game, x, y, asset)
    this.gamepad = new Gamepad(this, keymap, gamepad);
    this.anchor.setTo(0.5)
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
  }

  update(){
    if (this.gamepad.keyPressed(GAMEPAD_KEY.UP)
    || (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_1)) ==-1)
    {
        this.y--;
        this.animations.play('up')
    }
    else if (this.gamepad.keyPressed(GAMEPAD_KEY.DOWN)
    ||  (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_1)) ==1)
    {
        this.y++;
        this.animations.play('down')
        
    }

    if (this.gamepad.keyPressed(GAMEPAD_KEY.LEFT)
    || (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_0)) ==-1)
    {
        this.x--;
        this.animations.play('left')
        
    }
    else if (this.gamepad.keyPressed(GAMEPAD_KEY.RIGHT)
    || (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_0)) ==1)
    {
        this.x++;
        this.animations.play('right')
        
    }
    
    if(this.gamepad.keyPressed(GAMEPAD_KEY.ACTION)){
        this.height++;
    }
    if(this.gamepad.keyPressed(GAMEPAD_KEY.INTERACT)){
        this.height--;
    }
  }
}