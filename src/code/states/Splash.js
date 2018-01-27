import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('mushroom', 'src/sprites/mushroom2.png')
    this.load.image('dweller', 'src/sprites/dweller.png')

    this.load.image('u','src/sprites/placeholder.png')
    this.load.image('d','src/sprites/placeholder.png')
    this.load.image('l','src/sprites/placeholder.png')
    this.load.image('r','src/sprites/placeholder.png')
    this.load.image('m','src/sprites/placeholder.png')

    this.load.audio('u_morse','src/audio/U.ogg')
    this.load.audio('d_morse','src/audio/D.ogg')
    this.load.audio('l_morse','src/audio/L.ogg')
    this.load.audio('r_morse','src/audio/R.ogg')
    this.load.audio('m_morse','src/audio/M.ogg')
  }

  create () {
    this.state.start('Game')
  }
}
