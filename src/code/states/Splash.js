import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import DOOR_TYPE from '../actors/door'

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

    // Tilesets
    this.load.image('tiles1', 'src/sprites/tiles.png')

    // Doors
    // for (let type in DOOR_TYPE) {
    //   type = DOOR_TYPE[type];
    //   this.load.image(type.graphics, type.graphics_path);
    // }
    this.load.image('door1','src/sprites/actors/Door_1.png')

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
    this.load.image('dweller', 'src/sprites/dweller.png')
    
    this.load.spritesheet('au','src/sprites/actors/AU.png',16,16,5)
    this.load.spritesheet('ad','src/sprites/actors/AD.png',16,16,5)
    this.load.spritesheet('ar','src/sprites/actors/AR.png',16,16,5)
    this.load.spritesheet('al','src/sprites/actors/AL.png',16,16,5)
    this.load.spritesheet('m','src/sprites/actors/M.png',16,16,4)
    this.load.spritesheet('dweller','src/sprites/actors/Sprite_P1.png',16,16,4)
    this.load.spritesheet('dweller2','src/sprites/actors/Sprite_P1.png',16,16,4)
  }

  create () {
    this.state.start('Game')
  }
}