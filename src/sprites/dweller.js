import Phaser from 'phaser'
import { Gamepad, GAMEPAD_KEY } from '../gamepad/gamepad'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, keymap, gamepad }) {
    super(game, x, y, asset)
    this.gamepad = new Gamepad(this, keymap, gamepad);
    this.anchor.setTo(0.5)
  }

  update(){
    if (this.gamepad.keyPressed(GAMEPAD_KEY.UP))
    {
        this.y--;
    }
    else if (this.gamepad.keyPressed(GAMEPAD_KEY.DOWN))
    {
        this.y++;
    }

    if (this.gamepad.keyPressed(GAMEPAD_KEY.LEFT))
    {
        this.x--;
    }
    else if (this.gamepad.keyPressed(GAMEPAD_KEY.RIGHT))
    {
        this.x++;
    }
      
  }
}