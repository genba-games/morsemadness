import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
        preload() {
            // Load assets
            game.load.image('title_background', 'src/sprites/menu/maze.png');
        }
        create() {
            this.op_sos=game.add.audio('op_sos')
            this.op_sos.play()
            
            this.titleBackground = game.add.sprite(0, 0, 'title_background');
            this.backgroundTween = game.add.tween(this.titleBackground).to({x:-450,y:-280}, 10000,'Linear',false,0);
            this.backgroundTween.to({x:0,y:0}, 10000,'Linear',false,0);
            this.backgroundTween.loop(true);
            this.backgroundTween.start();
            this.titleBackground.inputEnabled = true;
            this.titleBackground.events.onInputDown.add(this.start_game, this);
            
            game.input.keyboard.onDownCallback = function(e) {   
                game.state.start('Game');
                game.input.keyboard.onDownCallback = undefined
            }
        }
        start_game() {
            game.state.start('Game');
            game.input.keyboard.onDownCallback = undefined
            
        }
    };