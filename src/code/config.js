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

config.signals=[
  {pattern:[config.T.U,config.T.U,config.T.D,config.T.D,config.T.L,config.T.R,config.T.L,config.T.R,config.T.M,config.T.M],difficulty:0,},
  {pattern:[config.T.L,config.T.U,config.T.R,config.T.M],difficulty:0},
  {pattern:[config.T.L,config.T.R,config.T.U,config.T.D,config.T.M],difficulty:0},
  {pattern:[config.T.U,config.T.D,config.T.R,config.T.M],difficulty:0},
  {pattern:[config.T.U,config.T.R,config.T.D,config.T.M],difficulty:0},
  {pattern:[config.T.L,config.T.R,config.T.D,config.T.L,config.T.R,config.T.M],difficulty:0},
  {pattern:[config.T.D,config.T.R,config.T.M],difficulty:0},
  {pattern:[config.T.M,config.T.U,config.T.L,config.T.D,config.T.R,config.T.M],difficulty:0},
  {pattern:[config.T.D,config.T.R,config.T.U,config.T.D,config.T.M],difficulty:0},
  {pattern:[config.T.M,config.T.R,config.T.D,config.T.R,config.T.D],difficulty:0},
  {pattern:[config.T.M,config.T.D,config.T.L,config.T.U,config.T.M],difficulty:0},
  {pattern:[config.T.L,config.T.D,config.T.R,config.T.M],difficulty:0},
  {pattern:[config.T.D,config.T.R,config.T.M],difficulty:0},
  {pattern:[config.T.U,config.T.R,config.T.R,config.T.L,config.T.R,config.T.M,config.T.R,config.T.L], difficulty:0},
  {pattern:[config.T.D,config.T.U,config.T.D,config.T.M,config.T.L,config.T.L,config.T.D,config.T.U,config.T.R,config.T.R], difficulty:0},
  {pattern:[config.T.U,config.T.M,config.T.L,config.T.L,config.T.U,config.T.M,config.T.L,config.T.R,config.T.L,config.T.M], difficulty:0},
  {pattern:[config.T.U,config.T.D,config.T.U,config.T.M,config.T.L,config.T.R,config.T.L,config.T.R,config.T.U,config.T.M,config.T.D,config.T.U,config.T.L,config.T.D,config.T.L,config.T.D], difficulty:0},
  {pattern:[config.T.D,config.T.U,config.T.L,config.T.L,config.T.M,config.T.R,config.T.D], difficulty:0},
  {pattern:[config.T.L,config.T.D,config.T.R,config.T.M,config.T.U], difficulty:0},
  {pattern:[config.T.D,config.T.M,config.T.U,config.T.M,config.T.D,config.T.M,config.T.L,config.T.M,config.T.D,config.T.M,config.T.R,config.T.M,config.T.U,config.T.M], difficulty:0},
  {pattern:[config.T.R,config.T.L,config.T.L,config.T.L,config.T.M], difficulty:0},]
export default config
