/* globals __DEV__ */
import Phaser from 'phaser'
import Dweller from '../actors/dweller'
import Operator from '../actors/operator'
import { GAMEPAD_KEY, KEYMAPS } from '../gamepad/gamepad'
import config from '../config'
import { generateMaze, TILE_TYPE } from '../maze'
import { MorseQ, morseFactory, signals } from '../actors/morsetx'
import Lava from '../actors/lava'
const arrayToCSV = require('array-to-csv')

const GAME_STATE = {
  PLAY: 1,
  END: 1,
}

export default class extends Phaser.State {
  init() { }
  preload() {
    this.mazeX = 0;
    this.mazeY = 6;
    this.mazeWidth = 59;
    this.mazeHeight = 13;

    this.lavaStartTimeMS = 10000;

    this.reset()
  }

  reset() {
    this.swapTimer=this.game.time.now
    // Setup groups
    this.gTilemap = this.game.add.group();
    this.gActors = this.game.add.group();
    this.gTx = this.game.add.group();
    this.gLava = this.game.add.group();

    this.gSignal = this.game.add.group();
    this.gSignal.enableBody = true;
    this.gSignal.physicsBodyType = Phaser.Physics.ARCADE;
    this.gSignal.createMultiple(30, 'signal');
    this.gSignal.setAll('anchor.x', 0.5);
    this.gSignal.setAll('anchor.y', 0.5);
    this.gSignal.setAll('outOfBoundsKill', true);
    this.gSignal.setAll('checkWorldBounds', true);

    // Kill all children in case groups are from previous game
    this.gActors.forEachAlive(o => o.destroy(), this);
    this.gTx.forEachAlive(o => o.destroy(), this);
    this.gSignal.forEachAlive(o => o.destroy(), this);

    // Clear the signal queue
    this.signalQ = new MorseQ();

    this.gTx.enableBody = true;

    // Create the dweller    
    this.dweller = new Dweller({
      game: this.game,
      x: 35,
      y: 35,
      asset: 'dweller',
    })
    this.game.add.existing(this.dweller);
    this.dweller.reset();

    // Prepare the maze tilemap
    var operatorMap = Array(5).fill(
      [
        TILE_TYPE.CLEAR,
        ...Array(config.horizontalTiles).fill(TILE_TYPE.CLEAR),
      ]
    );
    operatorMap.push(Array(config.horizontalTiles).fill(TILE_TYPE.PLAYER_WALL));
    for (let i = 0; i < config.verticalTiles - operatorMap.length - 2; i++) {
      let arr = Array(config.horizontalTiles).fill(TILE_TYPE.CLEAR)
      operatorMap.push(arr);
    }
    operatorMap.push(Array(config.horizontalTiles).fill(TILE_TYPE.PLAYER_WALL));

    // Generate the maze
    generateMaze(operatorMap,
      this.mazeX, this.mazeY, this.mazeWidth, this.mazeHeight,
      this.dweller, this.gActors,
      0.4, 0.25,
      this.gTx
    );

    // Create the tilemap
    operatorMap = arrayToCSV(operatorMap);
    this.game.cache.addTilemap('world', null, operatorMap, Phaser.Tilemap.CSV);
    this.map = this.game.add.tilemap('world', config.tileWidth, config.tileHeight);
    this.map.addTilesetImage('tiles1');
    this.map.setCollisionByExclusion([TILE_TYPE.CLEAR, TILE_TYPE.GOAL])
    this.map.setTileIndexCallback(TILE_TYPE.GOAL, this.win.bind(this));
    this.layer = this.map.createLayer(0);
    this.layer.resizeWorld();
    this.gTilemap.add(this.layer);

    // Create the operator
    this.antenna = this.game.add.existing(new Phaser.Sprite(
        this.game, 
        32, 
        50, 
        'antenna'
      )
    );
    this.antenna.anchor.set(0.5, 1);

    this.operator = new Operator(
      this.game,
      32,
      40,
      'operator',
      this.gSignal
    )
    this.game.add.existing(this.operator)

    // Setup lava
    this.lava = new Lava(
      this.game,
      this.mazeX * config.tileWidth,
      this.mazeY * config.tileHeight,
      (this.mazeWidth + 1) * config.tileWidth,
      this.mazeHeight * config.tileHeight,
    );
    this.gLava.add(this.lava);

    // Locate lava to the left of the screen
    this.lava.x = -config.horizontalTiles * (config.tileWidth);
    // Start the lava timer
    this.game.time.events.add(
      this.lavaStartTimeMS,
      this.lava.start,
      this.lava
    );

    this.gameState = GAME_STATE.PLAY;
  }

  create() {
    this.swapText = this.game.add.existing(new Phaser.Text(this.game, 100, 50, "SWAP", 'bold 72pt Arial'))
    this.swapText.addColor('rgba(179,200,176)', 0)
    this.swapText.scale.setTo(10, 10)
    this.swapText.alpha = 0
    // Start gamepads to track controller input
    this.game.input.gamepad.start();
    // Enable physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // DEBUG Controls
    // game.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.add(function() {
    //   let i = Math.floor(signals.length * Math.random());
    //   let pattern = signals[i].pattern;
    //   morseFactory(this.game, this.gTx, pattern);
    // }.bind(this), this);

    // game.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(function () {
    //   this.gTx.forEachAlive(tx => {
    //     tx.kill();
    //   });
    // }.bind(this), this);

    // // Swap characters
    // game.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(function () {
    //   this.swapRoles();
    // }.bind(this), this);

    // Restart game
    this.game.input.keyboard.addKey(Phaser.Keyboard.R).onDown.add(function () {
      game.state.restart(true, false);
    }.bind(this), this);
  }

  swapRoles() {
    // Kill all active signals
    this.gSignal.forEachAlive(alive => alive.kill() );
    if (this.swapTimer < this.game.time.now) {
      // Swap gamepads
      this.dweller.swapGamepads(this.operator);
      // Swap appereances
      let dwellerKey = this.dweller.key;
      this.dweller.loadTexture(this.operator.key);
      this.operator.loadTexture(dwellerKey);
      // Show swap text
      this.swapText.alpha = 1
      // StunThem
      this.dweller.toggleStun()
      this.operator.toggleStun()
      this.swapTimer = this.game.time.now + 3000
    }
  }

  stop() {
    this.lava.stop();

    // Stop players
    this.dweller.stop();
    this.operator.stop();
  }

  win() {
    this.stop()

    // Show win graphics
  }

  lose() {
    this.stop()

    // Show lose graphics
  }

  collideActor(collider, actor) {
    actor.collide(collider);
  }

  collideCollider(collider, actor) {
    collider.collide(actor);
  }

  update() {
    if (this.stunTimer < this.game.time.now) {
      this.dweller.enableController()
      this.operator.enableController()
    }
    if (this.swapText.alpha > 0.1) {
      this.swapText.alpha -= 0.008
    } else {
      this.swapText.alpha = 0
    }

    if (this.gameState === GAME_STATE.PLAY) {
      this.game.physics.arcade.collide(this.dweller, this.layer);
      this.game.physics.arcade.collide(this.dweller, this.gActors, this.collideActor);
      this.game.physics.arcade.overlap(this.gSignal, this.gTx, this.collideActor);
      this.game.physics.arcade.overlap(this.dweller, this.gLava, this.collideCollider);
    }
    else if (this.gameState === GAME_STATE.END
      && this.dweller.gamepad.keyPressed(GAMEPAD_KEY.ACTION)) {
      this.restart();
    }
  }

  render() {
    if (__DEV__) {
    }
  }
}
