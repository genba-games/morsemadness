/* globals __DEV__ */
import Phaser from 'phaser'
import { generateMaze, TILE_TYPE } from '../maze'
import Dweller from '../actors/dweller'
import Operator from '../actors/operator'
import GAMEPAD_KEY from '../gamepad/gamepad'
import config from '../config'
import { morseFactory, signals } from '../actors/morsetx'
const arrayToCSV = require('array-to-csv')

export default class extends Phaser.State {
  init () {}
  preload () {
    // Load the tilemap
    let tilemap = 'src/tilemaps/basetilemap.csv';
  }

  reset() {
    // Setup groups
    this.gActors = this.gActors || this.game.add.group();
    this.gTx = this.gActors || this.game.add.group();
    // Kill all children in case groups are from previous game
    this.gActors.forEachAlive(o => o.destroy(), this);
    this.gTx.forEachAlive(o => o.destroy(), this);

    // Prepare the maze tilemap
    var operatorMap = Array(5).fill(
      [
        TILE_TYPE.CLEAR,
        ...Array(config.horizontalTiles - 1).fill(TILE_TYPE.CLEAR),
      ]
    )
    operatorMap.push(Array(config.horizontalTiles).fill(TILE_TYPE.WALL));
    for (let i=0; i < config.verticalTiles - operatorMap.length; i++) {
      let arr = Array(config.horizontalTiles).fill(TILE_TYPE.CLEAR)
      operatorMap.push(arr);
    }

    // Generate the maze
    generateMaze(operatorMap, 0, 6, 59, 13, this.gActors, 0.6, 0.25);
    
    // Create the tilemap
    operatorMap = arrayToCSV(operatorMap);
    game.cache.addTilemap('world', null, operatorMap, Phaser.Tilemap.CSV);
    var map = game.add.tilemap('world', config.tileWidth, config.tileHeight);
    map.addTilesetImage('tiles1');
    var layer = map.createLayer(0);
    layer.resizeWorld();

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

    // Start gamepads to track controller input
    game.input.gamepad.start();
  }
  
  create () {
    this.debugKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

    this.reset();
  }

  update () {
    if (this.debugKey.isDown) {
      let i=Math.floor(Math.random()*Math.floor(this.signals.length))
      let pattern = this.signals[i].pattern
      morseFactory(this.game, this.gTx, pattern)
    }
  }
  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
