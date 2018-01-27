/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import generate from 'generate-maze'
import dweller from '../sprites/dweller'

var TILETYPE = {
  CLEAR: 0,
  WALL: 1,
  DOOR_LR: 2,
  DOOR_UD: 3,
};

/**
 * Generates a maze and populates it doors and objects.
 * @param {Number} height Height of the maze. MUST be odd.
 * @param {Number} width Width of the maze. MUST be odd.
 * @returns {Array[Array]} Matrix of the specified width and height containing 
 * TILETYPE entries.
 */
function generateMaze(width, height) {
  if (width % 2 == 0 || height % 2 == 0)
    throw 'Cannot generate maze with even dimensions. Dimensions MUST be odd!';

  // Reduce the space for the generator
  let gen = generate((width + 1) / 2, (height + 1) / 2);

  console.log(gen)

  let maze = [];
  for (let x=0; x < height; x++)
    maze.push(Array(width));

  for (let x=0; x < height; x += 2) {
    for (let y=0; y < width; y += 2) {
      let piece = gen[x/2][y/2];
      console.log('xy', x, y, 'lrud', piece.left, piece.right, piece.top, piece.bottom);
      // Set the current position to CLEAR
      maze[x][y] = TILETYPE.CLEAR;
      // Set the corner down right to wall
      if (x < height - 1 && y < width - 1)
        maze[x+1][y+1] = TILETYPE.WALL;
      // Set the right and bottom walls
      if (x < height - 1)
        maze[x+1][y] = piece.bottom ? TILETYPE.WALL : TILETYPE.CLEAR;
      if (y < width - 1)
        maze[x][y+1] = piece.right ? TILETYPE.WALL : TILETYPE.CLEAR;
    }
    console.log(' ');
  }

  for (let x=0; x < height; x++)
    console.log(maze[x]);

};

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

    var maze = generateMaze(5, 7);

    
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
