import Phaser from 'phaser'
import config from '../config'
import { MorseQ, signals, morseFactory, SIGNAL_DIFFICULTY } from '../actors/morsetx'
import Operator from '../actors/operator'
import { Gamepad } from '../gamepad/gamepad'
import Score from '../score'


export default class extends Phaser.State {
    create() {
        this.signalQ = new MorseQ();

        this.currentTransmission = {
            time: 0,
            pattern: [],
            missed: 0
        }
        this.pastTransmissions = []

        this.gTx = this.game.add.group();
        this.gActors = this.game.add.group();

        this.gSignal = this.game.add.group();
        this.gSignal.enableBody = true;
        this.gSignal.physicsBodyType = Phaser.Physics.ARCADE;

        this.gSignal.createMultiple(30, 'signal');
        this.gSignal.setAll('anchor.x', 0.5);
        this.gSignal.setAll('anchor.y', 0.5);
        this.gSignal.setAll('outOfBoundsKill', true);
        this.gSignal.setAll('checkWorldBounds', true);

        this.operator = new Operator(
            this.game,
            32,
            game.world.centerY,
            'operator',
            this.gSignal
        );
        this.game.add.existing(this.operator)
        this.operator.gamepad = new Gamepad(this.operator, 'pad1');
        this.score = new Score(this.game, 30, this.mazeY - 1)
        this.setCurrentTransmission()
        this.generateMorse()

        this.missedText = this.game.add.text(0, 0, "Missed " + this.currentTransmission.missed)
        this.patternText = this.game.add.text(0, 30, "Pattern " + this.currentTransmission.pattern)
        this.timeText = this.game.add.text(0, 60, "Time " + 0)
    }
    miss() {
        //this happens when you make mistakes.
        this.currentTransmission.missed++
        this.missedText.setText("Missed " + this.currentTransmission.missed)
    }
    generateMorse() {
        morseFactory(this.game, this.gTx)
        this.gTx.children.forEach(signal => {
            signal.y = signal.y + game.world.centerY - 40
        })
        //this stores the current transmission as an array
        this.updateCurrentTransmission()
    }
    updateCurrentTransmission() {
        this.currentTransmission.time = game.time.now - this.currentTransmission.time
        this.pastTransmissions.push(this.currentTransmission)
        this.setCurrentTransmission()
        this.gTx.forEachAlive(each => {
            this.currentTransmission.pattern.push(each.name)
        })
    }
    setCurrentTransmission() {
        this.currentTransmission.pattern = []
        this.currentTransmission.missed = 0
        this.currentTransmission.time = game.time.now
    }
    collideActor(collider, actor) {
        actor.collide(collider);
    }
    update() {
        this.game.physics.arcade.overlap(this.gSignal, this.gTx, this.collideActor);
        this.currentPatternTime = this.game.time.now - this.currentTransmission.time
        this.timeText.setText("Time " + this.currentPatternTime / Phaser.Timer.SECOND)
    }
};