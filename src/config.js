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
/*









*/ 
config.signals=[
  {pattern:[U,U,D,D,L,R,L,R,M,M],difficulty:0,},
  {pattern:[L,U,R,M],difficulty:0},
  {pattern:[L,R,U,D,M],difficulty:0},
  {pattern:[U,D,R,M],difficulty:0},
  {pattern:[U,R,D,M],difficulty:0},
  {pattern:[L,R,D,L,R,M],difficulty:0},
  {pattern:[D,R,M],difficulty:0},
  {pattern:[M,U,L,D,R,M],difficulty:0},
  {pattern:[D,R,U,D,M],difficulty:0},
  {pattern:[M,R,D,R,D],difficulty:0},
  {pattern:[M,D,L,U,M],difficulty:0},
  {pattern:[L,D,R,M],difficulty:0},
  {pattern:[D,R,M],difficulty:0},
  {pattern:[U,R,R,L,R,M,R,L], difficulty:0},
  {pattern:[D,U,D,M,L,L,D,U,R,R], difficulty:0},
  {pattern:[U,M,L,L,U,M,L,R,L,M], difficulty:0},
  {pattern:[U,D,U,M,L,R,L,R,U,M,D,U,I,D,I,D], difficulty:0},
  {pattern:[D,A,L,L,M,R,D], difficulty:0},
  {pattern:[L,D,R,M,U], difficulty:0},
  {pattern:[D,M,U,M,D,M,L,M,D,M,R,M,U,M], difficulty:0},
  {pattern:[R,L,L,L,M], difficulty:0},]
export default config
