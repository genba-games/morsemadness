import Phaser from 'phaser'
import { T } from './morsetx'
import Actor from './actor'
import { Gamepad, GAMEPAD_KEY } from '../gamepad/gamepad'


class Operator extends Actor {
  constructor(game, x, y, asset, gamepad, signalGroup) {

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
    console.log(keymap)
    this.signalTime=0
    
  }
  sendSignal(tx) {
    //create a bullet in the bulletGroup
    console.log(game.time.now)
    if (game.time.now > this.signalTime) {
      //  Grab the first bullet we can from the pool
      this.signal = this.signalGroup.getFirstExists(false);
      console.log('signal group',this.signalGroup)
      this.signalGroup.forEachExists(e=>{
        console.log(e)
      })
      console.log(this.signal)
      if (this.signal) {
        //  And fire it
        this.audio[tx.name].play()
        console.log("fuck")
        this.signal.name=tx.name
        this.signal.reset(this.x+2, this.y);
        this.signal.body.velocity.x = +400;
        this.signalTime = game.time.now + 500;
      }
    }


  }
  collide(target) {
    //check if signal.name equals target.name
  }
  update() {
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
function factory(game, x, y, asset, keymap, gamepad, signalGroup) {
  game.add.existing(new Operator(game, x, y, asset, keymap, gamepad, signalGroup))
  console.log(keymap)
}
const keymap = {
  [GAMEPAD_KEY.UP]: [
      Phaser.Keyboard.W,
      Phaser.Keyboard.UP,
      Phaser.Gamepad.PS3XC_DPAD_UP,
  ],
  [GAMEPAD_KEY.DOWN]: [
      Phaser.Keyboard.S,
      Phaser.Keyboard.DOWN,
      Phaser.Gamepad.PS3XC_DPAD_DOWN,
  ],
  [GAMEPAD_KEY.LEFT]: [
      Phaser.Keyboard.A,
      Phaser.Keyboard.LEFT,
      Phaser.Gamepad.PS3XC_DPAD_LEFT,
  ],
  [GAMEPAD_KEY.RIGHT]: [
      Phaser.Keyboard.D,
      Phaser.Keyboard.RIGHT,
      Phaser.Gamepad.PS3XC_DPAD_RIGHT,
  ],
  [GAMEPAD_KEY.ACTION]: [
      Phaser.Keyboard.X,
      Phaser.Keyboard.SPACE,
      Phaser.Gamepad.PS3XC_X,
      Phaser.Gamepad.BUTTON_2,
      
  ],
  [GAMEPAD_KEY.INTERACT]: [
      Phaser.Keyboard.Z,
      Phaser.Gamepad.PS3XC_CIRCLE,
      Phaser.Gamepad.BUTTON_1,
  ],
}
module.exports = { operatorFactory: factory }
