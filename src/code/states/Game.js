/* globals __DEV__ */
import Phaser from 'phaser'
import Dweller from '../actors/dweller'
import Operator from '../actors/operator'
import { GAMEPAD_KEY, KEYMAPS } from '../gamepad/gamepad'
import config from '../config'
import { generateMaze, generateDoors, generateItems, TILE_TYPE } from '../maze'
import { MorseQ, morseFactory, signals } from '../actors/morsetx'
import Lava from '../actors/lava'
import Score from '../score'
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
    this.swapTimer = this.game.time.now
    // Setup groups
    this.gTilemap = this.game.add.group();
    this.gActors = this.game.add.group();
    this.gTx = this.game.add.group();
    this.gLava = this.game.add.group();
    this.gUI = this.game.add.group();
    
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
    // Make 5 blank rows for the operator
    var operatorMap = Array(5).fill(
      Array(config.horizontalTiles).fill(TILE_TYPE.CLEAR),
    );
    // Make maze top wall row
    operatorMap.push(Array(config.horizontalTiles).fill(TILE_TYPE.PLAYER_WALL));
    // Generate the maze
    let maze = generateMaze(this.mazeWidth, this.mazeHeight, this.dweller);
    operatorMap = operatorMap.concat(maze);
    // Place maze doors
    generateDoors(
      maze,
      this.mazeX,
      this.mazeY,
      this.dweller,
      this.gActors,
      this.gTx,
      0.3
    )
    // Make maze bottom wall row
    operatorMap.push(Array(config.horizontalTiles).fill(TILE_TYPE.PLAYER_WALL));
    
    // Displace dweller by the offset of the maze
    // HACK This is not done at the creation of the dweller because the 
    // HACK generation of doors and items depends on the position of the 
    // HACK dweller assigned by generateMaze.
    this.dweller.y += this.mazeY * config.tileHeight;
    
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
    
    // Create the antenna
    this.antenna = this.game.add.existing(new Phaser.Sprite(
      this.game,
      30,
      8,
      'antenna'
    ));
    this.antenna.animations.add('', [0, 1, 2], 2, true).play()
    
    // Create the operator
    this.operator = new Operator(
      this.game,
      32,
      40,
      'operator',
      this.gSignal
    );
    
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
    this.score = new Score(this.game,30,this.mazeY-1)
    this.gUI.add(this.score)
    // Creating sfx audio object.
    this.sfx = {}
    this.sfx.swap = game.add.audio('swap')
    
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
    this.gSignal.forEachAlive(alive => alive.kill());
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
      this.dweller.stun()
      this.operator.stun()
      this.sfx.swap.play()

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
