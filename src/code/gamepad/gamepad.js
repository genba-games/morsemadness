import { GAMEPAD_KEY, KEYMAPS } from '../gamepad/gamepadConfig'
import merge from 'lodash/merge'
/**
 * This keymap is assigned to any new Gamepad that does not define a keymap.
 * Console neutral, PS3XC and XBOX360 buttons are all the same. They are 
 * used to make bindings simpler to configure for developers.
 */
var defaultKeymap = [{
    [GAMEPAD_KEY.UP]: [
        Phaser.Keyboard.W,
        Phaser.Gamepad.PS3XC_DPAD_UP,
    ],
    [GAMEPAD_KEY.DOWN]: [
        Phaser.Keyboard.S,
        Phaser.Gamepad.PS3XC_DPAD_DOWN,
    ],
    [GAMEPAD_KEY.LEFT]: [
        Phaser.Keyboard.A,
        Phaser.Gamepad.PS3XC_DPAD_LEFT,
        Phaser.Gamepad.AXIS_0
    ],
    [GAMEPAD_KEY.RIGHT]: [
        Phaser.Keyboard.D,
        Phaser.Gamepad.PS3XC_DPAD_RIGHT,
        Phaser.Gamepad.AXIS_0
    ],
    [GAMEPAD_KEY.ACTION]: [
        Phaser.Keyboard.Q,
        Phaser.Gamepad.PS3XC_X,
        Phaser.Gamepad.BUTTON_2,
    ],
    [GAMEPAD_KEY.INTERACT]: [
        Phaser.Keyboard.E,
        Phaser.Gamepad.PS3XC_CIRCLE,
        Phaser.Gamepad.BUTTON_1,
    ],
    axes: {
        [GAMEPAD_KEY.UPDOWN_AXIS]: [
            Phaser.Gamepad.AXIS_1,
            Phaser.Gamepad.AXIS_7
        ],
        [GAMEPAD_KEY.LEFTRIGHT_AXIS]: [
            Phaser.Gamepad.AXIS_0,
            Phaser.Gamepad.AXIS_6
        ]

    }
},
{
    [GAMEPAD_KEY.UP]: [
        Phaser.Keyboard.I,
        Phaser.Gamepad.PS3XC_DPAD_UP,
    ],
    [GAMEPAD_KEY.DOWN]: [
        Phaser.Keyboard.K,
        Phaser.Gamepad.PS3XC_DPAD_DOWN,
    ],
    [GAMEPAD_KEY.LEFT]: [
        Phaser.Keyboard.J,
        Phaser.Gamepad.PS3XC_DPAD_LEFT,
    ],
    [GAMEPAD_KEY.RIGHT]: [
        Phaser.Keyboard.L,
        Phaser.Gamepad.PS3XC_DPAD_RIGHT,
    ],
    [GAMEPAD_KEY.ACTION]: [
        Phaser.Keyboard.U,
        Phaser.Gamepad.BUTTON_2,

    ],
    [GAMEPAD_KEY.INTERACT]: [
        Phaser.Keyboard.O,
        Phaser.Gamepad.BUTTON_1,
    ],
}]

/**
 * Indicates whether a key assigned to a specific gamepad key is being 
 * pressed. 
 * Controller keys correspond to the keys of ``GAMEPAD_KEY`` object.
 * 
 * @param {Object} keymap Object containing the appropriate 
 * ``GAMEPAD_KEY``:[``Phaser.Keyboard``] configuration pairs. This is 
 * typically the controller assigned to the player.
 * @param {GAMEPAD_KEY} key Controller key to check.
 * @returns true if the key is being held, false otherwise.
 */
function keyPressed(keymap, key) {
    if (keymap.buttons) {
        let buttons = keymap.buttons
        key = buttons[key];
        // Check if key was processed by Phaser
        if (key === true || key === false)
            return key;
        // If it wasn't, check for assigned keys
        for (let k in key) {
            k = key[k];
            if (game.input.keyboard.isDown(k)
                || (this.pad && this.pad.justPressed(k)))
                return true;
        }
        return false;
    }
}


function axisPressed(keymap, axis, direction) {
    if (keymap.axes) {
        let axes = keymap.axes
        axis = axes[axis]
        for (let a in axis) {
            a = axis[a]
            if (direction === '+') {
                if (this.pad && this.pad.axis(a) < -0.8) {
                    return true
                }
            } else {
                if (this.pad && this.pad.axis(a) > 0.8) {
                    return true
                }
            }
        }
        return false
    }

}
/**
 * Creates a new gamepad with the specified keys for a player.
 * 
 * @param {Player} player Player instance to be assigned to the new gamepad.
 * @param {Object} keymap Object containing the appropriate 
 * ``GAMEPAD_KEY``:[``Phaser.Keyboard``] configuration pairs. This is 
 * typically the controller assigned to the player.
 * @param {String} pad String to define which pad you'll set to this player.
 */
function Gamepad(player, keymap, pad) {
    this.player = player;
    this.createGamepad(pad)
    this.keymap=KEYMAPS[pad]
    this._keyPressed = keyPressed
    this.keyPressed = function (key) {
        return this._keyPressed(this.keymap, key);
    }
    this._axisPressed = axisPressed
    this.axisPressed = function (axis, direction) {
        return this._axisPressed(this.keymap, axis, direction);
    }
};
Gamepad.prototype.createGamepad = function (pad) {
    this.pad = this.player.game.input.gamepad[pad]
    console.log(pad)
    console.log(this.pad)
    this.pad.addCallbacks(this, {
        onConnect: this.setKeymap
    })
}

Gamepad.prototype.setKeymap = function () {
    //This callback function executes when a pad is connected,
    //it looks up into our KEYMAPS and if it doesn't find it, it sets the default ps3/xbox360 gamepad
    let id = this.pad._rawPad.id
    let padKeymap
    for (let keymap in KEYMAPS) {
        keymap = KEYMAPS[keymap]
        if (keymap.id == id) {
            padKeymap = keymap
        }
    }
    merge(this.keymap,padKeymap)

}
module.exports = {
    GAMEPAD_KEY: GAMEPAD_KEY,
    Gamepad: Gamepad,
}
