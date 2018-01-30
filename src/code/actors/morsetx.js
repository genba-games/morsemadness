import Phaser from 'phaser'
import config from '../config'
import Actor from './actor'

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

}

class Morse extends Actor {
  constructor(game, x, y, asset, type) {
    super(game, x, y, asset);

    this.animations.add('glow', type.cycle, 12, true)

    this.door = false;
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
        game.state.getCurrentState().swapRoles()
      }
    }
    target.kill()
  }
}

function morseFactory(game, group, transmissions, door, player = 1) {
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
    game.state.getCurrentState().swapRoles()
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

const signals = [
  { difficulty: 0, pattern: [T.U, T.U, T.D, T.D, T.L, T.R, T.L, T.R, T.M, T.M] },
  { difficulty: 0, pattern: [T.L, T.U, T.R, T.M] },
  { difficulty: 0, pattern: [T.L, T.R, T.U, T.D, T.M] },
  { difficulty: 0, pattern: [T.U, T.D, T.R, T.M] },
  { difficulty: 0, pattern: [T.U, T.R, T.D, T.M] },
  { difficulty: 0, pattern: [T.L, T.R, T.D, T.L, T.R, T.M] },
  { difficulty: 0, pattern: [T.D, T.R, T.M] },
  { difficulty: 0, pattern: [T.M, T.U, T.L, T.D, T.R, T.M] },
  { difficulty: 0, pattern: [T.D, T.R, T.U, T.D, T.M] },
  { difficulty: 0, pattern: [T.M, T.R, T.D, T.R, T.D] },
  { difficulty: 0, pattern: [T.M, T.D, T.L, T.U, T.M] },
  { difficulty: 0, pattern: [T.L, T.D, T.R, T.M] },
  { difficulty: 0, pattern: [T.D, T.R, T.M] },
  { difficulty: 0, pattern: [T.U, T.R, T.R, T.L, T.R, T.M, T.R, T.L] },
  { difficulty: 0, pattern: [T.D, T.U, T.D, T.M, T.L, T.L, T.D, T.U, T.R, T.R] },
  { difficulty: 0, pattern: [T.U, T.M, T.L, T.L, T.U, T.M, T.L, T.R, T.L, T.M] },
  { difficulty: 0, pattern: [T.U, T.D, T.U, T.M, T.L, T.R, T.L, T.R, T.U, T.M, T.D, T.U, T.L, T.D, T.L, T.D] },
  { difficulty: 0, pattern: [T.D, T.U, T.L, T.L, T.M, T.R, T.D] },
  { difficulty: 0, pattern: [T.L, T.D, T.R, T.M, T.U] },
  { difficulty: 0, pattern: [T.D, T.M, T.U, T.M, T.D, T.M, T.L, T.M, T.D, T.M, T.R, T.M, T.U, T.M] },
  { difficulty: 0, pattern: [T.R, T.L, T.L, T.L, T.M] },
]

module.exports = {
  signals,
  morseFactory,
  MorseQ,
  T
}
