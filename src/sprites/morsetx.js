import Phaser from 'phaser'
import config from '../config'

export default function factory(game, group,transmissions, player=1)  {
  console.log(transmissions)
    var messageLength = transmissions.length
    var origin = config.gameWidth - messageLength * config.tileWidth
    transmissions.forEach(tx => {
      group.create(origin,tx.y,tx.art)
      origin += config.tileWidth
    })
}
