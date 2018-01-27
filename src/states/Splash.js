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
    this.load.image('mushroom', 'assets/images/mushroom2.png')
    this.load.image('dweller', 'assets/images/dweller.png')

    this.load.image('u','assets/images/placeholder.png')
    this.load.image('d','assets/images/placeholder.png')
    this.load.image('l','assets/images/placeholder.png')
    this.load.image('r','assets/images/placeholder.png')
    this.load.image('m','assets/images/placeholder.png')

    this.load.audio('u_morse','assets/audio/U.ogg')
    this.load.audio('d_morse','assets/audio/D.ogg')
    this.load.audio('l_morse','assets/audio/L.ogg')
    this.load.audio('r_morse','assets/audio/R.ogg')
    this.load.audio('m_morse','assets/audio/M.ogg')
  }

  create () {
    this.state.start('Game')
  }
}
