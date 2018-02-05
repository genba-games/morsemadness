import Phaser from 'phaser'
import Actor from './actor'
import config from '../config'
import { Gamepad } from '../gamepad/gamepad'
import {GAMEPAD_KEY } from '../gamepad/gamepadConfig'


export default class extends Actor {
  constructor ({ game, x, y, asset}) {
    super(game, x, y, asset)
        
    this.gamepad = new Gamepad(this, 0, 'pad1');

    // Enable physics
    game.physics.arcade.enable(this);
    let boundingBoxOffset = 2;
    this.body.collideWorldBounds = true;
    this.body.setSize(
        config.tileWidth - boundingBoxOffset, 
        config.tileHeight - boundingBoxOffset, 
        boundingBoxOffset / 2, 
        boundingBoxOffset / 2,
    );
    this.rip=game.add.audio('rip')
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
        [1, 3, 2, 0, 1, 3, 2, 0, 1, 3, 2, 0, 1, 3, 2, 0, 4],
        25,
        false,
    ).onComplete.add(this.kill.bind(this));

    // Movement speed
    this.speed = 90;
  }
  
  collide(target) {
    if (this.controllerEnabled) {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.disableController();
        this.play('death');
    }
  }

  kill() {
      this.rip.play()
      this.game.state.getCurrentState().lose();
      super.kill()
  }

  update() {
    if (this.controllerEnabled) {
        if (this.gamepad.keyPressed(GAMEPAD_KEY.UP)
        || this.gamepad.axisPressed(GAMEPAD_KEY.UPDOWN_AXIS,'+'))
        {
            this.body.velocity.y = -this.speed;
            this.animations.play('up');
        }
        else if (this.gamepad.keyPressed(GAMEPAD_KEY.DOWN)
        ||  this.gamepad.axisPressed(GAMEPAD_KEY.UPDOWN_AXIS,'-'))
        {
            this.body.velocity.y = this.speed;
            this.animations.play('down');
        }
        else this.body.velocity.y = 0;

        if (this.gamepad.keyPressed(GAMEPAD_KEY.LEFT)
        || this.gamepad.axisPressed(GAMEPAD_KEY.LEFTRIGHT_AXIS,'+'))
        {
            this.body.velocity.x = -this.speed;
            this.animations.play('left');
            
        }
        else if (this.gamepad.keyPressed(GAMEPAD_KEY.RIGHT)
        || this.gamepad.axisPressed(GAMEPAD_KEY.LEFTRIGHT_AXIS,'-'))
        {
            this.body.velocity.x = this.speed;
            this.animations.play('right');
        }
        else this.body.velocity.x = 0;

        if (this.gamepad.keyPressed(GAMEPAD_KEY.ACTION)){
            this.animations.play('twist')
        }
    }
  }
}