import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#22ccee'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', './src/sprites/loader-bg.png')
    this.load.image('loaderBar', './src/sprites/loader-bar.png')

    // This stops arrow keypresses from propagating to the browser. 
    // It is meant to stop scrolling the webpage
    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.UP, 
      Phaser.Keyboard.DOWN,
      Phaser.Keyboard.LEFT, 
      Phaser.Keyboard.RIGHT
    ]);
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
