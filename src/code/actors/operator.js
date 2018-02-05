import Phaser from 'phaser'
import { T } from './morsetx'
import Actor from './actor'
import { Gamepad, GAMEPAD_KEY } from '../gamepad/gamepad'

export default class extends Actor {
  constructor(game, x, y, asset, signalGroup) {    
    super(game, x, y, asset);
    this. gamepad = new Gamepad(this, 1, 'pad2');
    this.signalGroup = signalGroup
    this.audio = {
      U: game.add.audio(T.U.morse),
      D: game.add.audio(T.D.morse),
      L: game.add.audio(T.L.morse),
      R: game.add.audio(T.R.morse),
      M: game.add.audio(T.M.morse),
    };
    this.anchor.setTo(0.5);
    this.signalTime = game.time.now;
    this.controllerEnabled = true
  }
  sendSignal(tx) {
    //create a bullet in the bulletGroup
    if (game.time.now > this.signalTime) {
      //  Grab the first bullet we can from the pool
      this.signal = this.signalGroup.getFirstExists(false);
      if (this.signal) {
        //  And fire it
        this.audio[tx.name].play()
        this.signal.name = tx.name
        this.signal.reset(this.x + 2, this.y);
        this.signal.body.velocity.x = + 1200;
        this.signalTime = game.time.now + 200;
      }
    }
  }

  collide(target) {
    //when morse arrows collide what do
  }

  update() {
    if (this.controllerEnabled) {
      if (this.gamepad.keyPressed(GAMEPAD_KEY.UP)
        || (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_1)) == -1) {
        this.sendSignal(T.U)
        
      }
      else if (this.gamepad.keyPressed(GAMEPAD_KEY.DOWN)
        || (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_1)) == 1) {
        this.sendSignal(T.D)
      }

      if (this.gamepad.keyPressed(GAMEPAD_KEY.LEFT)
        || (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_0)) == -1) {
        this.sendSignal(T.L)
      }
      else if (this.gamepad.keyPressed(GAMEPAD_KEY.RIGHT)
        || (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_0)) == 1) {
        this.sendSignal(T.R)
      }

      if (this.gamepad.keyPressed(GAMEPAD_KEY.ACTION)) {
        this.sendSignal(T.M)
      }
      if (this.gamepad.keyPressed(GAMEPAD_KEY.INTERACT)) {
        this.sendSignal(T.M)
      }
    }
  }
}
