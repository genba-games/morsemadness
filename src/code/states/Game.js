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
  preload () {}

  reset() {
    // Setup groups
    this.gTilemap = this.gTilemap || this.game.add.group();
    this.gActors = this.gActors || this.game.add.group();
    this.gTx = this.gTx || this.game.add.group();
    // Kill all children in case groups are from previous game
    this.gActors.forEachAlive(o => o.destroy(), this);
    this.gTx.forEachAlive(o => o.destroy(), this);

    // Create the dweller
    if (!this.dweller) {
      this.dweller = new Dweller({
        game: this.game,
        x:35,
        y:35,
        asset:'dweller',
        gamepad: game.input.gamepad.pad1,
      })
      this.game.add.existing(this.dweller);
    }
    this.dweller.reset();

    // Prepare the maze tilemap
    var operatorMap = Array(5).fill(
      [
        TILE_TYPE.CLEAR,
        ...Array(config.horizontalTiles - 1).fill(TILE_TYPE.CLEAR),
      ]
    )
    operatorMap.push(Array(config.horizontalTiles).fill(TILE_TYPE.PLAYER_WALL));
    for (let i=0; i < config.verticalTiles - operatorMap.length - 2; i++) {
      let arr = Array(config.horizontalTiles).fill(TILE_TYPE.CLEAR)
      operatorMap.push(arr);
    }
    operatorMap.push(Array(config.horizontalTiles).fill(TILE_TYPE.PLAYER_WALL));

    // Generate the maze
    generateMaze(operatorMap, 
                 0, 6, 59, 13, 
                 this.dweller, this.gActors, 
                 0.4, 0.25,
                 this.gTx);
    
    // Create the tilemap
    operatorMap = arrayToCSV(operatorMap);
    game.cache.addTilemap('world', null, operatorMap, Phaser.Tilemap.CSV);
    var map = game.add.tilemap('world', config.tileWidth, config.tileHeight);
    map.addTilesetImage('tiles1');
    var layer = map.createLayer(0);
    layer.resizeWorld();
    this.gTilemap.add(layer);

    

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
  
  create () {
    this.debugKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

    // Initialize the game
    this.reset();

    // Start gamepads to track controller input
    game.input.gamepad.start();

    // Enable physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
  }

  update () {
    if (this.debugKey.isDown) {
      let i = Math.floor(Math.random()*Math.floor(signals.length))
      let pattern = signals[i].pattern
      morseFactory(this.game, this.gTx, pattern)
    }
  }
  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
