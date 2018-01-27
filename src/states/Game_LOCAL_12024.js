/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import generate from 'generate-maze'
import dweller from '../sprites/dweller'

export default class extends Phaser.State {
  init () {}
  preload () {}

  createShroom(mazeEntry, x, y) {
    if (mazeEntry.left)
      this.game.add.existing(new Mushroom({
        game: this.game,
        x: 100 + 96 * x - 96,
        y: 100 + 96 * y,
        asset: 'mushroom'
      }));
    if (mazeEntry.top)
      this.game.add.existing(new Mushroom({
        game: this.game,
        x: 100 + 96 * x,
        y: 100 + 96 * y - 96,
        asset: 'mushroom'
      }));
  }

  create () {
    const bannerText = 'GGJ 2018'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false
    })

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    var maze = generate(6, 3);

    for (let x = 0; x < maze[0].length; x++) {
      for (let y = 0; y < maze.length; y++) {
        this.createShroom(maze[y][x], x, y);
      }
    }
    this.game.add.existing(new dweller({
      game: this.game,
      x:35,
      y:35,
      asset:'dweller'
    }));
  }

  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
