var game = new Phaser.Game(960, 544, Phaser.AUTO, 'game_div');

// Add the game states
game.state.add('boot', bootState);
game.state.add('menu', menuState);
game.state.add('play', playState);

// Start the 'boot' state
game.state.start('boot');