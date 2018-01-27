import Phaser from 'phaser'
import config from '../config'

export default function factory(game, group, transmissions, player=1)  {
  console.log(transmissions)
    var messageLength = transmissions.length
    var position = messageLength * config.tileWidth
    var origin = config.gameWidth - position
    group.forEachAlive(aTx => {
      aTx.x -= position
    })
    transmissions.forEach(tx => {
      group.create(origin, tx.y, tx.art)
      origin += config.tileWidth
    })
}
