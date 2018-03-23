import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config'

export default class extends Phaser.State {
    create() {
        this.game.state.start('Menu')
    }
};