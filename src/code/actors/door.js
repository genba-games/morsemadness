import Actor from './actor'
import config from '../config'
import { signals, morseFactory } from'../actors/morsetx'
var randomObjProp = require('random-obj-prop')

/**
 * Types of doors.
 */
var DOOR_TYPE = {
  EASY: {
    graphics: 'door1',
    graphicsPath: 'src/sprites/actors/Door_1.png',
    difficulty: 0,
  },
  // MEDIUM: {
  //   graphics: '',
  //   graphicsPath: '',
  //   difficulty: 1,
  // },
  // HARD: {
  //   graphics: '',
  //   graphicsPath: '',
  //   difficulty: 2,
  // },
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
    this.difficulty = type.difficulty;
    this.active = false;

    // Set physics
    this.body.immovable = true;
    
    if (orientation === DOOR_ORIENTATION.LR) {
      this.anchor.setTo(0.5);
      this.angle += 90;
      this.x += config.tileWidth / 2;
      this.y += config.tileHeight / 2;
    }
  }

  /**
   * Creates a new combo for the operator
   * @param {Dweller} target 
   */
  collide(target) {
    if (!this.active) {
        // Stop door from sending more codes
        this.active = !this.active;
        // Call Morse Factory and create a new combo
        let i = Math.floor(signals.length * Math.random());
        let pattern = signals[i].pattern
        morseFactory(game, this.morseGroup, pattern, this);
    }
  }

  /**
   * Opens the door and allows the player to pass
   */
  open() {
    this.body.enable = false;
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

  x = x * config.tileWidth;
  y = y * config.tileHeight;

  // Resolve door type
  doorType = doorType || getRandomDoorType();

  group.add(new Door(group.game, x, y, doorType, orientation, morseGroup));
}

module.exports = {
  DOOR_TYPE,
  DOOR_ORIENTATION,
  doorFactory,
}
