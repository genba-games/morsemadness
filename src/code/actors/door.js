import Actor from './actor'
import config from '../config'
import { signals, morseFactory, SIGNAL_DIFFICULTY } from '../actors/morsetx'
var randomObjProp = require('random-obj-prop')

/**
 * Types of doors.
 */
//TODO add tint
var DOOR_TYPE = {
  EASY: {
    graphics: 'door1',
    graphicsPath: 'src/sprites/actors/Door_1.png',
    difficulty: SIGNAL_DIFFICULTY.EASY,
  },
  MEDIUM: {
    graphics: 'door1',
    graphicsPath: 'src/sprites/actors/Door_1.png',
    difficulty: SIGNAL_DIFFICULTY.MEDIUM,
    tint:0xffff00    
  },
  HARD: {
    graphics: 'door1',
    graphicsPath: 'src/sprites/actors/Door_1.png',
    difficulty: SIGNAL_DIFFICULTY.HARD,
    tint:0xff0000   
  },
}

var DOOR_ORIENTATION = {
  UD: 0,
  LR: 1,
}

/**
 * Gets a random type of door. Door types are defined in DOORTYPE.
 */
function getRandomDoorType() {
  return randomObjProp(DOOR_TYPE);
}

/**
 * Maze door. 
 * Doors are what generate morse codes when a player attempts to cross it.
 */
class Door extends Actor {
  constructor(game, x, y, type, orientation, morseGroup) {
    super(game, x, y, type.graphics);
    this.morseGroup = morseGroup
    this.game = game;
    this.difficulty = type.difficulty;
    this.active = false;

    // Set physics
    this.body.immovable = true;

    // Define animations
    this.animations.add('closed', [0], 12)
    this.animations.add('active', [1, 0], 1, true)
    this.animations.add('open', [], 12, false)

    if (orientation === DOOR_ORIENTATION.LR) {
      this.anchor.setTo(0.5);
      this.angle += 90;
      this.x += config.tileWidth / 2;
      this.y += config.tileHeight / 2;
    }
    //Set difficulty color
    if (type.tint) this.tint = type.tint
  }

  /**
   * Creates a new combo for the operator
   * @param {Dweller} target 
   */
  collide(target) {
    if (!this.active) {
      // Stop door from sending more codes
      this.active = !this.active;
      // Set door active animation
      this.play('active');

      morseFactory(this.game, this.morseGroup, this);
    }
  }

  /**
   * Opens the door and allows the player to pass
   */
  open() {
    this.body.enable = false;
    this.play('open')
  }
}

/**
 * Creates a door in the specified coordinates.
 * @param {Phaser.Group} group Door group.
 * @param {Number} x Horizontal position.
 * @param {Number} y Vertical position.
 * @param {DOOR_ORIENTATION} orientation Door orientation.
 * @param {DOOR_TYPE} doorType Door type. If this parameter is not defined a
 * random type of door will be generated.
 */
function doorFactory(group, x, y, orientation, doorType, morseGroup) {
  if (orientation === undefined)
    throw 'Orientation was not defined when creating door.';

  // Set difficulty
  let tier = x / config.horizontalTiles
  // Vary in difficulty slight to make doors less homogeneous
  let variance = 0.2;
  tier -= -variance + 2 * variance * Math.random();
  //Reduce updown doors difficulty
  if (orientation == DOOR_ORIENTATION.UD) tier -= 0.1 

  if (tier < 0.45) doorType = DOOR_TYPE.EASY
  else if (tier < 0.8) doorType = DOOR_TYPE.MEDIUM
  else doorType = DOOR_TYPE.HARD

  x = x * config.tileWidth;
  y = y * config.tileHeight;

  group.add(new Door(group.game, x, y, doorType, orientation, morseGroup));
}

module.exports = {
  DOOR_TYPE,
  DOOR_ORIENTATION,
  doorFactory,
}
