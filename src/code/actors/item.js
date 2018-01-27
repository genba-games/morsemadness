import Actor from './actor'

export default class extends Actor {
  constructor (game, x, y, asset, difficulty) {
    super(game, x, y, asset)

    this.active = false;
    this.difficulty = difficulty;
  }

  collide(target) {
    if (!this.active) {
        // Stop door from sending more codes
        this.active = True;
        // Call Morse Factory and create a new combo
        
    }    
  }
}