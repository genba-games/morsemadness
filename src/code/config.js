var config = {
  gameWidth: 960,
  gameHeight: 320,
  tileWidth: 16,
  tileHeight: 16,
  localStorageName: 'transmissionADKL'
}

config.horizontalTiles = config.gameWidth / config.tileWidth;
config.verticalTiles = config.gameHeight / config.tileHeight;

export default config
