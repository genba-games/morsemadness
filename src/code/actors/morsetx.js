import Phaser from 'phaser'
import config from '../config'

function factory(game, group, transmissions, player = 1) {
  console.log(transmissions)
  let messageLength = transmissions.length
  let position = messageLength * config.tileWidth
  let origin = config.gameWidth - position
  let audio = {
    U: game.add.audio(T.U.morse),
    D: game.add.audio(T.D.morse),
    L: game.add.audio(T.L.morse),
    R: game.add.audio(T.R.morse),
    M: game.add.audio(T.M.morse),
  }
 
  
  
  group.forEachAlive(aTx => {
    aTx.x -= position
  })

  transmissions.forEach(tx => {
    let morse=group.create(origin, tx.y, tx.art)
    origin += config.tileWidth
    morse.events.onKilled.add(audio[tx.name].play)
  })
}

const T = {
  U: {
    art: 'u',
    morse: 'u_morse',
    name: 'U',
    y: 0 * config.tileHeight
  },
  D: {
    art: 'd',
    morse: 'd_morse',
    name: 'D',
    y: 1 * config.tileHeight
  },
  L: {
    art: 'l',
    morse: 'l_morse',
    name: 'L',
    y: 2 * config.tileHeight
  },
  R: {
    art: 'r',
    morse: 'r_morse',
    name: 'R',
    y: 3 * config.tileHeight
  },
  M: {
    art: 'm',
    morse: 'm_morse',
    name: 'M',
    y: 4 * config.tileHeight
  }
}

const signals = [
  { pattern: [T.U, T.U, T.D, T.D, T.L, T.R, T.L, T.R, T.M, T.M], difficulty: 0, },
  { pattern: [T.L, T.U, T.R, T.M], difficulty: 0 },
  { pattern: [T.L, T.R, T.U, T.D, T.M], difficulty: 0 },
  { pattern: [T.U, T.D, T.R, T.M], difficulty: 0 },
  { pattern: [T.U, T.R, T.D, T.M], difficulty: 0 },
  { pattern: [T.L, T.R, T.D, T.L, T.R, T.M], difficulty: 0 },
  { pattern: [T.D, T.R, T.M], difficulty: 0 },
  { pattern: [T.M, T.U, T.L, T.D, T.R, T.M], difficulty: 0 },
  { pattern: [T.D, T.R, T.U, T.D, T.M], difficulty: 0 },
  { pattern: [T.M, T.R, T.D, T.R, T.D], difficulty: 0 },
  { pattern: [T.M, T.D, T.L, T.U, T.M], difficulty: 0 },
  { pattern: [T.L, T.D, T.R, T.M], difficulty: 0 },
  { pattern: [T.D, T.R, T.M], difficulty: 0 },
  { pattern: [T.U, T.R, T.R, T.L, T.R, T.M, T.R, T.L], difficulty: 0 },
  { pattern: [T.D, T.U, T.D, T.M, T.L, T.L, T.D, T.U, T.R, T.R], difficulty: 0 },
  { pattern: [T.U, T.M, T.L, T.L, T.U, T.M, T.L, T.R, T.L, T.M], difficulty: 0 },
  { pattern: [T.U, T.D, T.U, T.M, T.L, T.R, T.L, T.R, T.U, T.M, T.D, T.U, T.L, T.D, T.L, T.D], difficulty: 0 },
  { pattern: [T.D, T.U, T.L, T.L, T.M, T.R, T.D], difficulty: 0 },
  { pattern: [T.L, T.D, T.R, T.M, T.U], difficulty: 0 },
  { pattern: [T.D, T.M, T.U, T.M, T.D, T.M, T.L, T.M, T.D, T.M, T.R, T.M, T.U, T.M], difficulty: 0 },
  { pattern: [T.R, T.L, T.L, T.L, T.M], difficulty: 0 },]

module.exports = { signals, morseFactory: factory }