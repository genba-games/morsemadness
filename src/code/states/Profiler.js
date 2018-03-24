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
    this.currentTx = {
      time: 0,
      pattern: [],
      missed: 0,
      accuracy: 0,
      shots:0,
    }
    this.pastTx = [];
    this.statsTx = {
      timeAverage: 0,
      missedAverage: 0,
      timeTotal: 0,
      missTotal: 0,
      totalArrows: 0,
      totalBullets: 0,
      accuracy: 0,
    }
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
    this.missedText = this.game.add.text(0, 0, "Missed " + this.currentTx.missed)
    this.timeText = this.game.add.text(0, 60, "Time " + 0)
    // tx stats
    this.averageTimeText = this.game.add.text(350, 0, "Average time:" + this.statsTx.timeAverage)
    this.averageMissText = this.game.add.text(350, 30, "Average misses:" + this.statsTx.missedAverage)
    this.totalArrowsText = this.game.add.text(350, 60, "Arrows total:" + this.statsTx.totalArrows)

    //start stop button
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
    this.currentTx.missed++
    this.missedText.setText("Missed " + this.currentTx.missed)
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
    if (this.currentTx.pattern.length > 0) {
      this.currentTx.time = game.time.now - this.currentTx.time
      this.currentTx.shots = this.currentTx.miss + this.currentTx.pattern.length
      this.currentTx.accuracy = this.currentTx.miss / this.currentTx.shots
      this.pastTx.push(Object.assign({}, this.currentTx))
      this.setStatistics(this.currentTx)
      this.sendGAEvent(this.currentTx)
      this.setCurrentTransmission()
    }
  }
  setCurrentTransmission() {
    this.currentTx.pattern = []
    this.currentTx.missed = 0
    this.currentTx.time = game.time.now
  }
  storeCurrentTransmissions() {
    this.gArrows.forEachAlive(each => {
      this.currentTx.pattern += each.name
    })
  }
  collideActor(collider, actor) {
    actor.collide(collider);
  }
  sendGAEvent(tx) {
    let accuracyEvent=`Profiler:Transmission:${tx.pattern}:Accuracy`
    let shotsEvent=`Profiler:Transmission:${tx.pattern}:Shots`
    let missedEvent = `Profiler:Transmission:${tx.pattern}:Missed`
    let timeEvent = `Profiler:Transmission:${tx.pattern}:Time`
    sendDesignEvent(accuracyEvent, tx.accuracy);
    sendDesignEvent(missedEvent, tx.missed);
    sendDesignEvent(timeEvent, tx.time);
    sendDesignEvent(shotsEvent, tx.shots)
  }
  setStatistics(tx) {
    this.statsTx.missTotal += tx.missed
    this.statsTx.missedAverage = this.statsTx.missTotal / this.pastTx.length
    this.statsTx.timeTotal += tx.time
    this.statsTx.timeAverage = this.statsTx.timeTotal / this.pastTx.length
    this.statsTx.totalArrows += tx.pattern.length
    this.statsTx.totalBullets += (tx.pattern.length + this.statsTx.missTotal)
    this.statsTx.accuracy = this.statsTx.totalBullets / this.statsTx.missTotal
  }
  updateTimer() {
    this.timeText.setText("Time " + this.currentPatternTime / Phaser.Timer.SECOND);
  }
  updateStatsText() {
    this.missedText.setText("Missed " + this.currentTx.missed)
    this.averageTimeText.setText("Average time:" + this.statsTx.timeAverage.toFixed(2))
    this.averageMissText.setText("Average misses:" + this.statsTx.missedAverage.toFixed(2))
    this.totalArrowsText.setText("Arrows total:" + this.statsTx.totalArrows)
  }
  update() {
    this.game.physics.arcade.overlap(this.gSignal, this.gArrows, this.collideActor);

    if (this.generate === true) {
      this.currentPatternTime = this.game.time.now - this.currentTx.time;
      this.updateTimer()
      if (this.gArrows.countLiving() == 0) {
        this.gSignal.killAll();
        this.generateMorse();
        this.storeCurrentTransmissions()
        this.updateStatsText()

      }
    }
  }
};