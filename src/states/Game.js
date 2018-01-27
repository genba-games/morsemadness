/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import { generateMaze, TILE_TYPE } from '../code/maze'
import Dweller from '../sprites/dweller'
import Operator from '../sprites/operator'
import GAMEPAD_KEY from '../gamepad/gamepad'
import config from '../config'
import MorseTx from '../sprites/morsetx'

export default class extends Phaser.State {
  init () {}
  preload () {
  }

  createShroom(mazeEntry, x, y) {
    let offset = 50;
    let mult = 48;
    if (mazeEntry === TILE_TYPE.WALL)
      this.game.add.existing(new Mushroom({
        game: this.game,
        x: offset + mult * x - mult,
        y: offset + mult * y,
        asset: 'mushroom'
      }));
  }
  
  create () {
    this.debugKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    const bannerText = 'GGJ 2018'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false
    })

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    var maze = generateMaze(9, 25);

    for (let x = 0; x < maze.length; x++) {
      for (let y = 0; y < maze[0].length; y++) {
        this.createShroom(maze[x][y], x, y);
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
    this.T = config.T
    this.gTx = this.game.add.group();
    var txArray = [this.T.U, this.T.U, this.T.D, this.T.D,this.T.D,this.T.M,this.T.U]
    MorseTx(this.game, this.gTx, txArray)
  }
  update () {
    if(this.debugKey.isDown){
      var pattern=config.pattern[getRandomInt(config.pattern.lenght)]
      MorseTx(this.game, this.gTx, pattern)
  }
  }
  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
