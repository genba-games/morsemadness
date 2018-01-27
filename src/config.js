var config = {
  gameWidth: 960,
  gameHeight: 544,
  tileWidth: 16,
  tileHeight: 16,
  localStorageName: 'transmissionADKL'
}

config.T={
  U:{art:'u',
     morse:'u_morse',
     y:0*config.tileHeight},
  D:{art:'d',
     morse:'d_morse',
     y:1*config.tileHeight},
  L:{art:'l',
     morse:'l_morse',
     y:2*config.tileHeight},
  R:{art:'r',
     morse:'r_morse',
     y:3*config.tileHeight},
  M:{art:'m',
     morse:'m_morse',
     y:4*config.tileHeight}
}
config.horizontalTiles = config.gameWidth / config.tileWidth;
config.verticalTiles = config.gameHeight / config.tileHeight;

export default config
