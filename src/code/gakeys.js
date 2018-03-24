export default {
    enable: process.env.GA_ENABLE=='true',
    game: process.env.GA_GAME,
    secret: process.env.GA_SECRET,
    version: process.env.VERSION
}