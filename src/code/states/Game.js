/* globals __DEV__ */
import Phaser from 'phaser'
import { generateMaze, TILE_TYPE } from '../maze'
import Dweller from '../actors/dweller'
import {operatorFactory} from '../actors/operator'
import GAMEPAD_KEY from '../gamepad/gamepad'
import config from '../config'
import { morseFactory, signals } from '../actors/morsetx'
const arrayToCSV = require('array-to-csv')

export default class extends Phaser.State {
  init() { }
  preload() { }

  reset() {
    // Setup groups
    this.gTilemap = this.gTilemap || this.game.add.group();
    this.gActors = this.gActors || this.game.add.group();
    this.gTx = this.gTx || this.game.add.group();
    this.gSignal = this.gSignal || this.game.add.group();
    // Kill all children in case groups are from previous game
    this.gActors.forEachAlive(o => o.destroy(), this);
    this.gTx.forEachAlive(o => o.destroy(), this);

    // Setup signal 
    this.gSignal.enableBody = true;
    this.gSignal.physicsBodyType = Phaser.Physics.ARCADE;
    this.gSignal.createMultiple(30, 'signal');
    this.gSignal.setAll('anchor.x', 0.5);
    this.gSignal.setAll('anchor.y', 0.5);
    this.gSignal.setAll('outOfBoundsKill', true);
    this.gSignal.setAll('checkWorldBounds', true);

    // Create the dweller
    if (!this.dweller) {
      this.dweller = new Dweller({
        game: this.game,
        x: 35,
        y: 35,
        asset: 'dweller',
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
    for (let i = 0; i < config.verticalTiles - operatorMap.length - 2; i++) {
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
    this.map = game.add.tilemap('world', config.tileWidth, config.tileHeight);
    this.map.addTilesetImage('tiles1');
    this.map.setCollisionByExclusion([TILE_TYPE.CLEAR, TILE_TYPE.GOAL])
    this.layer = this.map.createLayer(0);
    this.layer.resizeWorld();
    this.gTilemap.add(this.layer);
    
    
    operatorFactory(this.game, 32, 40, 'operator', game.input.gamepad.pad2, this.gSignal);
  }

  create() {
    // Initialize the game
    this.reset();

    // Start gamepads to track controller input
    game.input.gamepad.start();

    // Enable physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // DEBUG
    game.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.add(function() {
      console.log(this);
      let i = Math.floor(signals.length * Math.random());
      let pattern = signals[i].pattern;
      morseFactory(this.game, this.gTx, pattern);
    }.bind(this), this);

    game.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(function() {
      this.gTx.forEachAlive(tx => {
        tx.kill();
      });
    }.bind(this), this);
  }

  collideActors(collider, actor) {
    console.log('COLLIDING',actor,collider);
    actor.collide(collider);
  }


  update() {
    game.physics.arcade.collide(this.dweller, this.layer);
    game.physics.arcade.collide(this.dweller, this.gActors, this.collideActors);
    
    game.physics.arcade.collide(this.gSignal, this.gTx, this.collideActors);
  }
  render() {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
