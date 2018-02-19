import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import DOOR_TYPE from '../actors/door'

export default class extends Phaser.State {
  init() { }

  preload() {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    // Eye catcher menu
    this.load.image('title_background', 'src/sprites/menu/maze.png');    
    this.load.spritesheet('morseTitle','src/sprites/menu/morseTitleComplete.png')
    // Tilesets
    this.load.image('tiles1', 'src/sprites/tiles.png')
    this.load.spritesheet('lava', 'src/sprites/actors/lava.png', 16, 16, 3);

    // Doors
    this.load.spritesheet('door1', 'src/sprites/actors/door_1.png', 16, 16, 5);

    this.load.audio('u_morse', 'src/audio/u.wav')
    this.load.audio('d_morse', 'src/audio/d.wav')
    this.load.audio('l_morse', 'src/audio/l.wav')
    this.load.audio('r_morse', 'src/audio/r.wav')
    this.load.audio('m_morse', 'src/audio/m.wav')
    this.load.audio('swap','src/audio/swap.wav')

    this.load.audio('opSos', 'src/audio/op_sos.wav')
    this.load.audio('rip', 'src/audio/rip.wav')

    this.load.audio('menuMusic','src/audio/menu_music.ogg')
    

    this.load.spritesheet('au', 'src/sprites/actors/AU.png', 16, 16)
    this.load.spritesheet('ad', 'src/sprites/actors/AD.png', 16, 16)
    this.load.spritesheet('ar', 'src/sprites/actors/AR.png', 16, 16)
    this.load.spritesheet('al', 'src/sprites/actors/AL.png', 16, 16)
    this.load.spritesheet('m', 'src/sprites/actors/M.png', 16, 16)
    this.load.spritesheet('dweller', 'src/sprites/actors/Sprite_P1.png', 16, 16)
    this.load.spritesheet('operator', 'src/sprites/actors/Sprite_P2.png', 16, 16)
    this.load.spritesheet('antenna', 'src/sprites/actors/operator_antenna.png', 20, 48)

    this.load.spritesheet('status', 'src/sprites/actors/status.png', 16, 16)

    this.load.image('signal', 'src/sprites/actors/signal.png')
  }

  create() {
    this.state.start('Menu')
  }
}
