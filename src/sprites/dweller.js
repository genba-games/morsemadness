import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)

    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
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