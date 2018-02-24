import Phaser from 'phaser'
import config from './config'
export default class Score extends Phaser.Text {
    constructor(game, x, y) {
        x = x * config.tileWidth
        y = y * config.tileHeight
        super(game, x, y,"",{ font: "bold 16px Arial" ,fill:"white"})
        this.score=0
        this.setText(this.score)
    }
    addScore(score, modifiers) {
        this.score += Number(score)
        this.setText(this.score)
    }
    setText(text) {
        this.text = text.toString().padStart(10, 0)
    }
}

