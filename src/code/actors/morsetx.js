import Phaser from 'phaser'
import config from '../config'
import Actor from './actor'
var randomObjProp = require('random-obj-prop')

class MorseQ {
  constructor() {
    this.q = [];
    this.length = 0;
  }

  push(item) {
    this.q.push(item);
    this.length++;
  }

  isNext(value) {
    let v = this.q[0];
    return v !== undefined && v.name === value;
  }

  next() {
    this.length--;
    return this.q.shift();
  }
  
  reset(){
    this.q=[];
  }

}

class Morse extends Actor {
  constructor(game, x, y, asset, type) {
    super(game, x, y, asset);

    this.animations.add('glow', type.cycle, 12, true)
    
    this.door = false;
    this.score = game.score
  }

  kill() {
    if (this.door) {
      this.door.open();
    }
    super.kill();
  }

  collide(target) {
    //check if target equals morses name
    if (target.name) {
      // If the target has the right code
      if (this.q.isNext(target.name)) {
        // Send the signal flying to the right
        // The signal is killed automatically when it goes out of bounds
        this.q.next().body.velocity.x = 600;
      } else {
        game.state.getCurrentState().miss()
      }
    }
    target.kill()
    game.state.getCurrentState().score.addScore(10)
  }
}

function morseFactory(game, group, door, player = 1) {
  let transmissions = door ? getSignal(door.difficulty) : getSignal()
  let offset = 1.5
  let messageLength = transmissions.length
  let position = offset * messageLength * config.tileWidth
  let origin = config.gameWidth - position
  if (group.countLiving() * offset < 45) {
    group.forEachAlive(aTx => {
      aTx.x -= position
    })
    let tint = 0xffffff - (Math.random() * 0x444444)
    transmissions.forEach((tx, id) => {
      let morse = group.getFirstExists(false);
      if (!morse || morse.name != tx.name) {
        morse = game.add.existing(new Morse(game, origin, tx.y, tx.art, tx))
        group.add(morse)
      } else {
        morse.reset(origin, tx.y)
      }
      // Assign the door if it is the last key in a transmission
      morse.door = id === transmissions.length - 1 && door;
      morse.play('glow');
      morse.tint = tint;
      morse.checkWorldBounds = true;
      morse.outOfBoundsKill = true;
      morse.name = tx.name;
      morse.q = game.state.getCurrentState().signalQ;
      morse.q.push(morse);
      origin += config.tileWidth * offset;
    })
  } else {
    //what happnes when we reach the limit?
    game.state.getCurrentState().miss()
  }
}
const T = {
  U: {
    art: 'au',
    morse: 'u_morse',
    name: 'U',
    cycle: [0, 1, 2, 3, 4, 3, 2, 1,],
    y: 0 * config.tileHeight
  },
  L: {
    art: 'al',
    morse: 'l_morse',
    name: 'L',
    cycle: [0, 1, 2, 3, 4, 3, 2, 1,],
    y: 1 * config.tileHeight
  },
  R: {
    art: 'ar',
    morse: 'r_morse',
    name: 'R',
    cycle: [0, 1, 2, 3, 4, 3, 2, 1,],
    y: 2 * config.tileHeight
  },
  D: {
    art: 'ad',
    morse: 'd_morse',
    name: 'D',
    cycle: [4, 3, 2, 1, 0, 1, 2, 3],
    y: 3 * config.tileHeight
  },
  M: {
    art: 'm',
    morse: 'm_morse',
    name: 'M',
    cycle: [0, 1, 2, 3, 2, 1,],
    y: 4 * config.tileHeight
  }
}

const SIGNAL_DIFFICULTY = {
  EASY: 0,
  MEDIUM: 1,
  HARD: 2
}

const signals = {
  [SIGNAL_DIFFICULTY.EASY]: [
    { pattern: [T.D, T.R, T.M] },
    { pattern: [T.M, T.M, T.M, T.M] },
    { pattern: [T.L, T.D, T.R, T.M] },
    { pattern: [T.L, T.U, T.R, T.M] },
    { pattern: [T.U, T.D, T.R, T.M] },
    { pattern: [T.U, T.R, T.D, T.M] },
  ],
  [SIGNAL_DIFFICULTY.MEDIUM]: [
    { pattern: [T.L, T.R, T.U, T.D, T.M] },
    { pattern: [T.D, T.R, T.U, T.D, T.M] },
    { pattern: [T.M, T.D, T.L, T.U, T.M] },
    { pattern: [T.R, T.L, T.L, T.L, T.M] },
    { pattern: [T.M, T.R, T.D, T.R, T.D] },
    { pattern: [T.L, T.D, T.R, T.M, T.U] },
    { pattern: [T.L, T.R, T.D, T.L, T.R, T.M] },
    { pattern: [T.M, T.U, T.L, T.D, T.R, T.M] },
    { pattern: [T.D, T.U, T.L, T.L, T.M, T.R, T.D] },
  ],
  [SIGNAL_DIFFICULTY.HARD]: [
    { pattern: [T.U, T.R, T.R, T.L, T.R, T.M, T.R, T.L] },
    { pattern: [T.D, T.U, T.D, T.M, T.L, T.L, T.D, T.U, T.R, T.R] },
    { pattern: [T.U, T.U, T.D, T.D, T.L, T.R, T.L, T.R, T.M, T.M] },
    { pattern: [T.U, T.M, T.L, T.L, T.U, T.M, T.L, T.R, T.L, T.M] },
    { pattern: [T.D, T.M, T.U, T.M, T.D, T.M, T.L, T.M, T.D, T.M, T.R, T.M, T.U, T.M] },
    { pattern: [T.U, T.D, T.U, T.M, T.L, T.R, T.L, T.R, T.U, T.M, T.D, T.U, T.L, T.D, T.L, T.D] },
  ]
}
function getSignal(difficulty) {
  if (difficulty == undefined) difficulty = randomObjProp(SIGNAL_DIFFICULTY)
  return randomObjProp(signals[difficulty]).pattern
}
module.exports = {
  signals,
  morseFactory,
  MorseQ,
  T,
  SIGNAL_DIFFICULTY
}
