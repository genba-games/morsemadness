require('dotenv').config({path: '../../.env'})
export default {
    enable: false,
    game: process.env.GA_GAME,
    secret: process.env.GA_SECRET,
    version: process.env.VERSION
} 