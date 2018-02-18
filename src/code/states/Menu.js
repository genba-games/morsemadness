import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
        create() {
            this.opSos=game.add.audio('opSos');

            this.menuMusic=game.add.audio('menuMusic');
            this.menuMusic.loop=true;
            
            this.titleBackground = game.add.sprite(0, 0, 'title_background');
            this.backgroundTween = game.add.tween(this.titleBackground).to({x:-450,y:-280}, 10000,'Linear',false,0);
            this.backgroundTween.to({x:0,y:0}, 10000,'Linear',false,0);
            this.backgroundTween.loop(true);
            this.backgroundTween.start();
            this.titleBackground.inputEnabled = true;
            this.titleBackground.events.onInputDown.add(this.start_game, this);
            this.menuMusic.play();
            
            game.input.keyboard.callbackContext=this
            game.input.keyboard.onDownCallback = this.start_game
            
        }
        start_game() {
            game.state.start('Game');
            game.input.keyboard.onDownCallback = undefined;
            this.menuMusic.destroy();
            this.opSos.play();
            
        }
    };