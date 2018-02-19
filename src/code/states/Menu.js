import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config'

export default class extends Phaser.State {
    create() {
        this.opSos = game.add.audio('opSos');

        this.menuMusic = game.add.audio('menuMusic');
        this.menuMusic.loop = true;

        this.titleBackground = this.game.add.image(0, 0, 'title_background');
        this.backgroundTween = this.game.add.tween(this.titleBackground).to({ x: -450, y: -280 }, 20000, 'Linear', false, 0);
        this.backgroundTween.to({ x: 0, y: 0 }, 20000, 'Linear', false, 0);
        this.backgroundTween.loop(true);
        this.backgroundTween.start();
        this.titleBackground.inputEnabled = true;
        this.titleBackground.events.onInputDown.add(this.start_game, this);

        this.morseTitle = this.game.add.image(0, 0, 'morseTitle')
        
        this.blackBox = this.game.add.graphics(0,0)
        this.blackBox.beginFill(0x000000)
        this.blackBox.drawRect(0,0,config.gameWidth,config.gameHeight)
        this.blackBoxTween = this.game.add.tween(this.blackBox).to({alpha:0},11000,Phaser.Easing.Quadratic.In)
        
        this.menuMusic.play();
        this.blackBoxTween.start()
        
        this.game.input.keyboard.callbackContext = this
        this.game.input.keyboard.onDownCallback = this.start_game

    }
    start_game() {
        game.state.start('Game');
        game.input.keyboard.onDownCallback = undefined;
        this.menuMusic.destroy();
        this.opSos.play();

    }
};