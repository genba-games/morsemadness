/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import generate from 'generate-maze'
import Dweller from '../sprites/dweller'
import Operator from '../sprites/operator'
import GAMEPAD_KEY from '../gamepad/gamepad'


export default class extends Phaser.State {
  init () {}
  preload () {}

  createShroom(mazeEntry, x, y) {
    if (mazeEntry.left)
      this.game.add.existing(new Mushroom({
        game: this.game,
        x: 100 + 96 * x - 96,
        y: 100 + 96 * y,
        asset: 'mushroom'
      }));
    if (mazeEntry.top)
      this.game.add.existing(new Mushroom({
        game: this.game,
        x: 100 + 96 * x,
        y: 100 + 96 * y - 96,
        asset: 'mushroom'
      }));
  }
  
  create () {
    const bannerText = 'GGJ 2018'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false
    })

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    var maze = generateMaze(5, 7);

    for (let x = 0; x < maze[0].length; x++) {
      for (let y = 0; y < maze.length; y++) {
        this.createShroom(maze[y][x], x, y);
      }
    }

    //ACTORS
    game.input.gamepad.start();

    this.game.add.existing(new Dweller({
      game: this.game,
      x:35,
      y:35,
      asset:'dweller',
      gamepad: game.input.gamepad.pad1,
    }));
    this.game.add.existing(new Operator({
      game: this.game,
      x:500,
      y:500,
      asset:'dweller',
      keymap: {
        [GAMEPAD_KEY.UP]: [
            Phaser.Keyboard.W,
            Phaser.Keyboard.UP
        ],
        [GAMEPAD_KEY.DOWN]: [
            Phaser.Keyboard.S,
            Phaser.Keyboard.DOWN
        ],
        [GAMEPAD_KEY.LEFT]: [
            Phaser.Keyboard.A,
            Phaser.Keyboard.LEFT
        ],
        [GAMEPAD_KEY.RIGHT]: [
            Phaser.Keyboard.D,
            Phaser.Keyboard.RIGHT
        ],
        [GAMEPAD_KEY.ACTION]: [
            Phaser.Keyboard.X,
            Phaser.Keyboard.SPACE,
        ],
      },
      gamepad: game.input.gamepad.pad2,
    }));
  }

  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
