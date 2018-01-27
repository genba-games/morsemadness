import Actor from './actor'

export default class extends Actor {
  collide(target) {
    // Affect target here

    // Destroy the item
    this.kill();
  }
}