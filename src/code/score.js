import Phaser from 'phaser'
import config from './config'
export default class Score extends Phaser.Text {
    constructor(game, x, y) {
        x = x * config.tileWidth
        y = y * config.tileHeight
        super(game, x, y, "", { font: "bold 16px Arial", fill: "white" })
        this.value = 0
        this.setText(this.value)
    }
    addScore(score, modifiers) {
        this.value += Number(score)
        this.setText(this.value)
    }
    setText(text) {
        this.text = text.toString().padStart(10, 0)
    }
}

