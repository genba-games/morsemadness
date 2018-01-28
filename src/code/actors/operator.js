import Phaser from 'phaser'
import { T } from './morsetx'
import Actor from './actor'
import { Gamepad, GAMEPAD_KEY } from '../gamepad/gamepad'


class Operator extends Actor {
  constructor(game, x, y, asset, keymap, gamepad, signalGroup) {
    super(game, x, y, asset);
    this.gamepad = new Gamepad(this, keymap, gamepad);
    this.signalGroup=signalGroup
    this.audio = {
      U: game.add.audio(T.U.morse),
      D: game.add.audio(T.D.morse),
      L: game.add.audio(T.L.morse),
      R: game.add.audio(T.R.morse),
      M: game.add.audio(T.M.morse),
    }
    this.anchor.setTo(0.5)
  }
  sendSignal(tx) {
    //create a bullet in the bulletGroup
    if (game.time.now > signalTime) {
      //  Grab the first bullet we can from the pool
      signal = this.signalGroup.getFirstExists(false);
      signal.name=tx.name
      if (signal) {
        //  And fire it
        signal.reset(this.x+2, this.y);
        signal.body.velocity.x = +400;
        signalTime = game.time.now + 200;
      }
    }


  }
  collide(target) {
    //check if signal.name equals target.name
  }
  update() {
    if (this.gamepad.keyPressed(GAMEPAD_KEY.UP)
      || (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_1)) == -1) {
      sendSignal(T.U)
    }
    else if (this.gamepad.keyPressed(GAMEPAD_KEY.DOWN)
      || (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_1)) == 1) {
      sendSignal(T.D)
    }

    if (this.gamepad.keyPressed(GAMEPAD_KEY.LEFT)
      || (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_0)) == -1) {
      sendSignal(T.L)
    }
    else if (this.gamepad.keyPressed(GAMEPAD_KEY.RIGHT)
      || (this.gamepad.pad.axis(Phaser.Gamepad.AXIS_0)) == 1) {
      sendSignal(T.R)
    }

    if (this.gamepad.keyPressed(GAMEPAD_KEY.ACTION)) {
      sendSignal(T.M)
    }
    if (this.gamepad.keyPressed(GAMEPAD_KEY.INTERACT)) {
      sendSignal(T.M)
    }
  }
}
function factory(game, x, y, asset, keymap, gamepad, signalGroup, morseGroup) {

  game.add.existing(new Operator(game, x, y, asset, keymap, gamepad, signalGroup))
}

module.exports = { operatorFactory: factory }
