import { GAMEPAD_KEY, KEYMAPS, KEYMAP_KEYS } from '../gamepad/gamepadConfig'
import { merge, keys } from 'lodash'

/**
 * Assigns a specific gamepad a player.
 * 
 * @param {Player} player Player instance to be assigned to the new gamepad.
 * @param {String} pad Name of the Phaser pad that will be assigned to the 
 * specified player. These pads are named 'pad1' through 'pad4'.
 */
class Gamepad {
    constructor(player, pad) {
        this.player = player;
        // Temporarily use the default keymap, it will be replaced during 
        // `_setKeymap` if a more specific keymap is found
        this.keymap = KEYMAP_KEYS[pad];
        // Presses are registered to be able to tell when a key/button was just 
        // pressed
        this.justPressed = {};
        // Store the Phaser gamepad
        this.pad = this.player.game.input.gamepad[pad];
        // Setup the init callback for the specific gamepad
        this.pad.addCallbacks(this, {
            onConnect: this._setKeymap,
            onDown: this._onDownJustPressedCallback,
            onUp: this._onReleaseJustPressedCallback,
        });
    }

    /**
     * Updates the justPressed object to reflect the buttons that were 
     * recently pressed.
     */
    _onDownJustPressedCallback(button) {
        this.justPressed[button] = true;
    }

    /**
     * Updates the justPressed object to reflect the buttons that were 
     * recently released.
     */
    _onReleaseJustPressedCallback(button) {
        this.justPressed[button] = false;
    }

    /**
     * Callback function executed when a pad is connected. Assigns a 
     * KEYMAP to this gamepad. 
     * The KEYMAP determines the relationship between game keys (defined in 
     * `GAMEPAD_KEY`) and gamepad buttons (defined in `KEYMAP_KEYS`, containing 
     * `Phaser.Keyboard`/`Phaser.Gamepad`).
     * The specific keymap for the controller type is looked for in KEYMAP_KEYS,
     * defaulting to the PS3/XBOX360 keymap if it doesn't find one.
     */
    _setKeymap () {
        let id = this.pad._rawPad.id;
        // Attempt to find a specific config or default to PS3/XBOX360
        let padKeymap = KEYMAP_KEYS[id] || KEYMAP_KEYS[KEYMAPS.PS3XBOX360];
        // Merge with initial keymap
        merge(this.keymap, padKeymap);
    };

    /**
     * Indicates whether a key/button assigned to a specific game key is being 
     * pressed.
     * 
     * @param {GAMEPAD_KEY} key Controller key to check.
     * @returns true if the key is being held, false otherwise.
     */ 
    keyPressed (key) {
        if (this.keymap.buttons) {
            key = this.keymap.buttons[key];
            // Check if key was processed by Phaser
            if (key === true || key === false)
                return key;
            // If it wasn't, check for assigned keys
            for (let k in key) {
                k = key[k];
                if (game.input.keyboard.isDown(k)
                    || (this.pad && this.pad.isDown(k)))
                    return true;
            }
            return false;
        }
    };

    /**
     * Indicates whether a key/button assigned to a specific game key was just
     * pressed since the last time the controller was checked.
     * 
     * @param {GAMEPAD_KEY} key Controller key to check.
     * @returns true if the key was just pressed, false otherwise.
     */
    keyJustPressed(key) {
        if (this.keymap.buttons) {
            key = this.keymap.buttons[key];
            for (let k in key) {
                k = key[k];
                if (this.justPressed[k]) {
                    // This is set to false manually as it won't be updated 
                    // until the onDown event is fired. This will make next 
                    // calls to this method return false.
                    this.justPressed[k] = false;
                    return true;
                }
                return false;
            }
        }
    }

    /**
     * Indicates whether an axis is being activated within a threshold in the 
     * specified direction.
     * Axis input is interpreted as a discrete input based on the threshold.
     * 
     * @param {Phaser.Gamepad} axis Phaser axis identifier.
     * @param {Number} direction 1/-1 indicating the axis sign.
     * @param {Number} [threshold=0.8] Threshold the axis must pass to be 
     * considered true.
     * @returns true if the axis is being held over the threshold in the 
     * specified direction, false otherwise.
     */ 
    axisPressed(axis, direction, threshold=0.8) {
        if (this.keymap.axes) {
            axis = this.keymap.axes[axis];
            for (let a in axis)
                if (this.pad && threshold < this.pad.axis(axis[a]) * direction)
                    return true;
                    
            return false;
        }
    };
};

module.exports = {
    GAMEPAD_KEY: GAMEPAD_KEY,
    Gamepad: Gamepad,
}
