/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import { generateMaze, TILE_TYPE } from '../maze'
import Dweller from '../sprites/dweller'
import Operator from '../sprites/operator'
import GAMEPAD_KEY from '../gamepad/gamepad'
import config from '../config'
import MorseTx from '../sprites/morsetx'
const arrayToCSV = require('array-to-csv')

export default class extends Phaser.State {
  init () {}
  preload () {
    // Load the tilemap
    let tilemap = 'src/tilemaps/basetilemap.csv';
    game.load.image('tiles1', 'assets/images/tileset.png');
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

    // Prepare the maze tilemap
    var operatorMap = Array(5).fill(
      [
        TILE_TYPE.CLEAR,
        ...Array(config.horizontalTiles - 2).fill(TILE_TYPE.CLEAR), 
        TILE_TYPE.WALL
      ]
    )
    operatorMap.push(Array(config.horizontalTiles).fill(TILE_TYPE.WALL));
    for (let i=0; i < config.verticalTiles - operatorMap.length; i++) {
      let arr = Array(config.horizontalTiles).fill(TILE_TYPE.CLEAR)
      operatorMap.push(arr);
    } 
    generateMaze(operatorMap, 0, 6, 59, 11);
    
    // Create the tilemap
    operatorMap = arrayToCSV(operatorMap);
    game.cache.addTilemap('world', null, operatorMap, Phaser.Tilemap.CSV);
    var map = game.add.tilemap('world', config.tileWidth, config.tileHeight);
    map.addTilesetImage('tiles1');
    var layer = map.createLayer(0);
    layer.resizeWorld();

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
      let i=Math.floor(Math.random()*Math.floor(config.signals.length))
      let pattern = config.signals[i].pattern
      MorseTx(this.game, this.gTx, pattern)
  }
  }
  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
