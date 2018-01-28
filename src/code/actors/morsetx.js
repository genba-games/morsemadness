import Phaser from 'phaser'
import config from '../config'
import Actor from './actor'
class Signal extends Actor{
  constructor(game, x, y, asset) {
    super(game, x, y, asset);
  }
}
function factory(game, group, transmissions, door, player = 1) {
  let messageLength = transmissions.length
  let position = messageLength * config.tileWidth
  let origin = config.gameWidth - position
  
  group.forEachAlive(aTx => {
    aTx.x -= position
  })
  let tint= 0xffffff-(Math.random()*0x444444)
  transmissions.forEach(tx => {
    let morse = group.getFirstExists(false);
    if(!morse){
      morse=game.add.existing(new Signal(game, origin, tx.y, tx.art))
      group.add(morse)
    }else{
      morse.reset(origin,tx.y)
    }
    morse.a = morse.animations.add('glow')
    morse.animations.add('glow', tx.cycle, 12, true)
    morse.play('glow')
    morse.tint=tint
    morse.checkWorldBounds=true
    morse.outOfBoundsKill=true
    morse.name=tx.name
    origin += config.tileWidth
  })
}

const T = {
  U: {
    art: 'au',
    morse: 'u_morse',
    name: 'U',
    cycle:[0,1,2,3,4,3,2,1,],
    y: 0 * config.tileHeight
  },
  D: {
    art: 'ad',
    morse: 'd_morse',
    name: 'D',
    cycle:[4,3,2,1,0,1,2,3],
    y: 1 * config.tileHeight
  },
  L: {
    art: 'al',
    morse: 'l_morse',
    name: 'L',
    cycle:[0,1,2,3,4,3,2,1,],
    y: 2 * config.tileHeight
  },
  R: {
    art: 'ar',
    morse: 'r_morse',
    name: 'R',
    cycle:[0,1,2,3,4,3,2,1,],
    y: 3 * config.tileHeight
  },
  M: {
    art: 'm',
    morse: 'm_morse',
    name: 'M',
    cycle:[0,1,2,3,2,1,],
    y: 4 * config.tileHeight
  }
}

const signals = [
  { difficulty: 0, pattern: [T.U, T.U, T.D, T.D, T.L, T.R, T.L, T.R, T.M, T.M]},
  { difficulty: 0, pattern: [T.L, T.U, T.R, T.M]},
  { difficulty: 0, pattern: [T.L, T.R, T.U, T.D, T.M]},
  { difficulty: 0, pattern: [T.U, T.D, T.R, T.M]},
  { difficulty: 0, pattern: [T.U, T.R, T.D, T.M]},
  { difficulty: 0, pattern: [T.L, T.R, T.D, T.L, T.R, T.M]},
  { difficulty: 0, pattern: [T.D, T.R, T.M]},
  { difficulty: 0, pattern: [T.M, T.U, T.L, T.D, T.R, T.M]},
  { difficulty: 0, pattern: [T.D, T.R, T.U, T.D, T.M]},
  { difficulty: 0, pattern: [T.M, T.R, T.D, T.R, T.D]},
  { difficulty: 0, pattern: [T.M, T.D, T.L, T.U, T.M]},
  { difficulty: 0, pattern: [T.L, T.D, T.R, T.M]},
  { difficulty: 0, pattern: [T.D, T.R, T.M]},
  { difficulty: 0, pattern: [T.U, T.R, T.R, T.L, T.R, T.M, T.R, T.L]},
  { difficulty: 0, pattern: [T.D, T.U, T.D, T.M, T.L, T.L, T.D, T.U, T.R, T.R]},
  { difficulty: 0, pattern: [T.U, T.M, T.L, T.L, T.U, T.M, T.L, T.R, T.L, T.M]},
  { difficulty: 0, pattern: [T.U, T.D, T.U, T.M, T.L, T.R, T.L, T.R, T.U, T.M, T.D, T.U, T.L, T.D, T.L, T.D]},
  { difficulty: 0, pattern: [T.D, T.U, T.L, T.L, T.M, T.R, T.D]},
  { difficulty: 0, pattern: [T.L, T.D, T.R, T.M, T.U]},
  { difficulty: 0, pattern: [T.D, T.M, T.U, T.M, T.D, T.M, T.L, T.M, T.D, T.M, T.R, T.M, T.U, T.M]},
  { difficulty: 0, pattern: [T.R, T.L, T.L, T.L, T.M]},
]

module.exports = { 
  signals, 
  morseFactory: factory,
  T 
}