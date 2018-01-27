import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, gamepad}) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)

    this.upKey = gamepad.up;
    this.downKey = gamepad.down;
    this.leftKey = gamepad.left;
    this.rightKey = gamepad.right;
    this.actionKey = gamepad.action;
  }

  update(){
    if (this.upKey.isDown)
    {
        this.y--;
    }
    else if (this.downKey.isDown)
    {
        this.y++;
    }

    if (this.leftKey.isDown)
    {
        this.x--;
    }
    else if (this.rightKey.isDown)
    {
        this.x++;
    }
      
  }
}