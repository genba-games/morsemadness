import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config'
import { initAnalytics } from '../analytics'

export default class extends Phaser.State {
    create() {
        // Start game analytics!
        initAnalytics()
        
        // Audio
        this.opSos = game.add.audio('opSos');

        this.menuMusic = game.add.audio('menuMusic');
        this.menuMusic.loop = true;

        // White maze background
        this.titleBackground = this.game.add.image(0, 0, 'title_background');
        this.backgroundTween = this.game.add.tween(this.titleBackground).to({ x: -450, y: -280 }, 20000, 'Linear', false, 0);
        this.backgroundTween.to({ x: 0, y: 0 }, 20000, 'Linear', false, 0);
        this.backgroundTween.loop(true);
        this.backgroundTween.start();
        this.titleBackground.inputEnabled = true;
        this.titleBackground.events.onInputDown.add(this.startGame, this);

        // buttons
        this.buttonsY = 218

        this.startGameButton = game.add.button(game.world.centerX - 72, this.buttonsY, 'startbutton', this.startGame, this, 2, 0, 1);
        this.startGameButton.visible = false
        this.startGameButton.appear = () => { this.startGameButton.visible = true }
        game.time.events.add(13131, this.startGameButton.appear, this);


        this.startProfilerButton = game.add.button(game.world.centerX + 24, this.buttonsY, 'startbutton', this.startProfiler, this, 8, 6, 7);
        this.startProfilerButton.visible = false
        this.startProfilerButton.appear = () => { this.startProfilerButton.visible = true }
        game.time.events.add(13131, this.startProfilerButton.appear, this);

        // Titles
        this.morseTitle = this.game.add.image(0, 0, 'morseTitle')

        this.blackBox = this.game.add.graphics(0, 0)
        this.blackBox.beginFill(0x000000)
        this.blackBox.drawRect(0, 0, config.gameWidth, config.gameHeight)
        this.blackBoxTween = this.game.add.tween(this.blackBox).to({ alpha: 0 }, 11000, Phaser.Easing.Quadratic.In)

        this.morse = this.game.add.image(0, 40, 'titleScreenMorse')
        this.setTitleScreenText(this.morse, 11511)

        this.madness = this.game.add.image(0, 260, 'titleScreenMadness')
        this.setTitleScreenText(this.madness, 12112)


        this.menuMusic.play();
        this.blackBoxTween.start()
        game.time.events.add(this.morse.appearDelay, this.morse.appear, this);
        game.time.events.add(this.madness.appearDelay, this.madness.appear, this);

        this.game.input.keyboard.callbackContext = this
        this.game.input.keyboard.onDownCallback = this.startGame

    }
    startState(state) {
        game.state.start(state);
        game.input.keyboard.onDownCallback = undefined;
        this.menuMusic.destroy();
        this.opSos.play();
    }
    startGame() {
        this.startState('Profiler')
        // this.startState('Game')
    }
    startProfiler() {
        this.startState('Profiler')
    }
    setTitleScreenText(titleObject, delay) {
        titleObject.anchor.setTo(0.5)
        titleObject.x = game.world.centerX
        titleObject.appearDelay = delay
        titleObject.visible = false
        titleObject.appear = () => { titleObject.visible = true }
    }
};