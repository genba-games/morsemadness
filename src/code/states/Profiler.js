import Phaser from 'phaser'
import config from '../config'
import { MorseQ, signals, morseFactory, SIGNAL_DIFFICULTY } from '../actors/morsetx'
import Operator from '../actors/operator'
import { Gamepad } from '../gamepad/gamepad'
import Score from '../score'
import { sendDesignEvent } from '../analytics'
const arrayToCSV = require('array-to-csv')

export default class extends Phaser.State {
  create() {
    this.signalQ = new MorseQ();
    this.generate = false;
    this.currentTransmission = {
      time: 0,
      pattern: [],
      missed: 0
    }
    this.pastTransmissions = [];

    let profilerMap = Array(14)
    for (let i = 0; i < 7; i++) {
      profilerMap[i] = Array(config.horizontalTiles).fill(4);
    }
    profilerMap[7] = profilerMap[13] = Array(config.horizontalTiles).fill(2);
    for (let i = 8; i < 13; i++) {
      profilerMap[i] = Array(config.horizontalTiles).fill(1);
    }
    profilerMap = arrayToCSV(profilerMap);
    this.game.cache.addTilemap('profiler', null, profilerMap, Phaser.Tilemap.CSV);
    this.map = this.game.add.tilemap('profiler', config.tileWidth, config.tileHeight);
    this.map.addTilesetImage('bricks');
    this.layer = this.map.createLayer(0);

    this.gArrows = this.game.add.group();
    this.gActors = this.game.add.group();

    this.gSignal = this.game.add.group();
    this.gSignal.enableBody = true;
    this.gSignal.physicsBodyType = Phaser.Physics.ARCADE;
    this.createSignals()

    this.operator = new Operator(
      this.game,
      32,
      game.world.centerY + 9,
      'operator',
      this.gSignal
    );
    this.game.add.existing(this.operator);
    this.operator.gamepad = new Gamepad(this.operator, 'pad1');
    this.score = new Score(this.game, 30, this.mazeY - 1);
    this.setCurrentTransmission();
    // current pattern 
    this.missedText = this.game.add.text(0, 0, "Missed " + this.currentTransmission.missed)
    this.patternText = this.game.add.text(0, 30, "Pattern " + this.currentTransmission.pattern)
    this.timeText = this.game.add.text(0, 60, "Time " + 0)


    this.startButton = game.add.button(game.world.centerX - 48, 240, 'startbutton', this.toggleGeneration, this, 1, 0, 2);
  }
  createSignals() {
    this.gSignal.createMultiple(30, 'signal');
    this.gSignal.setAll('anchor.x', 0.5);
    this.gSignal.setAll('anchor.y', 0.5);
    this.gSignal.setAll('outOfBoundsKill', true);
    this.gSignal.setAll('checkWorldBounds', true);
  }
  toggleGeneration() {
    this.generate = !this.generate
    if (this.generate == true) {
      this.startButton.setFrames(4, 3, 5)
    } else {
      this.startButton.setFrames(1, 0, 2);
      this.clearGeneration();
    }
  }
  clearGeneration() {
    this.gArrows.killAll()
    this.signalQ.reset()
  }
  miss() {
    //this happens when you make mistakes.
    this.currentTransmission.missed++
    this.missedText.setText("Missed " + this.currentTransmission.missed)
  }
  generateMorse() {
    morseFactory(this.game, this.gArrows)
    this.gArrows.children.forEach(signal => {
      signal.y = signal.y + game.world.centerY - 32
    })
    //this stores the current transmission as an array
    this.updateCurrentTransmission()
  }
  updateCurrentTransmission() {
    if (this.currentTransmission.pattern.length > 0) {
      this.currentTransmission.time = game.time.now - this.currentTransmission.time
      this.pastTransmissions.push(Object.assign({}, this.currentTransmission))
      this.sendGAEvent(this.currentTransmission)
      this.setCurrentTransmission()
    }
  }
  setCurrentTransmission() {
    this.currentTransmission.pattern = []
    this.currentTransmission.missed = 0
    this.currentTransmission.time = game.time.now
  }
  storeCurrentTransmissions() {
    this.gArrows.forEachAlive(each => {
      this.currentTransmission.pattern += each.name
    })
  }
  collideActor(collider, actor) {
    actor.collide(collider);
  }
  sendGAEvent(transmission) {
    let missedEvent = `Profiler:Transmission:${transmission.pattern}:Missed`
    let timeEvent = `Profiler:Transmission:${transmission.pattern}:Time`
    sendDesignEvent(missedEvent, transmission.missed);
    sendDesignEvent(timeEvent, transmission.time);
  }
  update() {
    this.game.physics.arcade.overlap(this.gSignal, this.gArrows, this.collideActor);

    if (this.generate === true) {
      this.currentPatternTime = this.game.time.now - this.currentTransmission.time;
      this.timeText.setText("Time " + this.currentPatternTime / Phaser.Timer.SECOND);
      if (this.gArrows.countLiving() == 0) {
        this.gSignal.killAll();
        this.generateMorse();
        this.storeCurrentTransmissions()
        this.patternText.setText("Pattern " + this.currentTransmission.pattern)
        this.missedText.setText("Missed " + this.currentTransmission.missed)

      }
    }
  }
};