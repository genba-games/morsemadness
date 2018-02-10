import { GAMEPAD_KEY, KEYMAPS, KEYMAP_KEYS } from '../gamepad/gamepadConfig'
import { merge, keys } from 'lodash'

// They keyboard is shared between all players, so just pressed keys must be
// shared between all Gamepad instances.
var keysJustPressed = {};

/**
 * Assigns a specific gamepad a player.
 * 
 * @param {Player} player Player instance to be assigned to the new gamepad.
 * @param {String} pad Name of the Phaser pad that will be assigned to the 
 * specified player. These pads are named 'pad1' through 'pad4'.
 * @param {Number} [axisThreshold=0.8] Value between 0-1 indicating the 
 * threshold at which an axis is considered pressed.
 */
class Gamepad {
    constructor(player, pad, axisThreshold=0.8) {
        this.player = player;
        // Temporarily use the default keymap, it will be replaced during 
        // `_setKeymap` if a more specific keymap is found
        this.keymap = KEYMAP_KEYS[pad];
        // Set the threshold for discrete axis keypresses
        this.axisThreshold = axisThreshold;
        // Presses are registered to be able to tell when a key/button was just 
        // pressed
        this.justPressed = {
            keys: keysJustPressed,
            buttons: {},
            axes: {},
        };
        // Setup keyboard callbacks
        game.input.keyboard.addCallbacks(this, 
            this._keyboardOnDownCallback,
            this._keyboardOnReleaseCallback,
        );
        // Store the Phaser gamepad
        this.pad = this.player.game.input.gamepad[pad];
        // Setup the callbacks for the specific gamepad
        this.pad.addCallbacks(this, {
            onConnect: this._gamepadOnConnectCallback,
            onDown: this._gamepadOnDownJustPressedCallback,
            onUp: this._gamepadOnReleaseJustPressedCallback,
            onAxis: this._gamepadOnAxisCallback,
        });
    };

    /**
     * Updates the justPressed object to reflect the keys that were 
     * recently pressed.
     */
    _keyboardOnDownCallback(key) {
        if (this.justPressed.keys[key.keyCode] === undefined)
            this.justPressed.keys[key.keyCode] = true;
    };
    
    /**
     * Updates the justPressed object to reflect the keys that were 
     * recently released.
     */
    _keyboardOnReleaseCallback(key) {
        if (this.justPressed.keys[key.keyCode] !== undefined)
            this.justPressed.keys[key.keyCode] = undefined;
    };

    /**
     * Callback function executed when a pad is connected. Assigns a 
     * KEYMAP to this gamepad. 
     * The KEYMAP determines the relationship between game keys (defined in 
     * `GAMEPAD_KEY`) and gamepad buttons (defined in `KEYMAP_KEYS`, containing 
     * `Phaser.Keyboard`/`Phaser.Gamepad`).
     * The specific keymap for the controller type is looked for in KEYMAP_KEYS,
     * defaulting to the PS3/XBOX360 keymap if it doesn't find one.
     */
    _gamepadOnConnectCallback() {
        let id = this.pad._rawPad.id;
        // Attempt to find a specific config or default to PS3/XBOX360
        let padKeymap = KEYMAP_KEYS[id] || KEYMAP_KEYS[KEYMAPS.PS3XBOX360];
        // Merge with initial keymap
        merge(this.keymap, padKeymap);
    };

    /**
     * Updates the justPressed object to reflect the buttons that were 
     * recently pressed.
     */
    _gamepadOnDownJustPressedCallback(button) {
        this.justPressed.buttons[button] = true;
    };

    /**
     * Updates the justPressed object to reflect the buttons that were 
     * recently released.
     */
    _gamepadOnReleaseJustPressedCallback(button) {
        this.justPressed.buttons[button] = false;
    };

    /**
     * Updates the justPressed object to reflect the axes that recently 
     * surpassed the threshold.
     */
    _gamepadOnAxisCallback(gamepad, axis, value) {
        // Set the axis direction
        let direction = value > 0 ? 1 : -1;
        if (direction === -1) axis = '-' + axis;

        // Axes need 3 states to be able to handle all states:
        // * undefined - Axis was released from the pressed position.
        // * true - Axis was pressed from the released position.
        // * false - Axis was manually deactivated in keyJustPressed to 
        //           evaluating this axis pressed as true.
        // Axes can only become true if the justPressed state is undefined.
        // If it is false, it should NOT change to true as it implies the 
        // axis was manually desactivated and was never physically released.
        value = this.axisThreshold <= value * direction;
        // Physically pressed the axis
        if (this.justPressed.axes[axis] === undefined && value)
            this.justPressed.axes[axis] = true;
        // Physically released the axis
        else if (this.justPressed.axes[axis] !== undefined && !value)
            this.justPressed.axes[axis] = undefined;
    };

    /**
     * Indicates whether a keyboard key is being pressed.
     * 
     * @param {Phaser.Keyboard} key Phaser Keyboard key identifier.
     * @returns true if the key is being pressed.
     */ 
    _checkKeyPress(key) {
        return game.input.keyboard.isDown(key);
    };

    /**
     * Indicates whether a controller button is being pressed.
     * 
     * @param {Phaser.Gamepad} button Phaser Gamepad button identifier.
     * @returns true if the gamepad is connected and the button is being 
     * pressed, false otherwise.
     */ 
    _checkButtonPress(button) {
        if (!this.pad)
            return false;

        return this.pad.isDown(button);
    };

    /**
     * Indicates whether an axis is being activated within a threshold in the 
     * specified direction.
     * Axis input is interpreted as a discrete input based on axisThreshold.
     * 
     * @param {Object} axis Object containing the Phaser axis identifier and 
     * axis direction.
     * @param {Phaser.Gamepad} axis.axis Phaser axis identifier.
     * @param {Number} axis.direction 1/-1 indicating the axis direction.
     * @returns true if the gamepad is connected and the axis is being 
     * pressed, false otherwise.
     */ 
    _checkAxisPress(axis) {
        if (!this.pad)
            return false;

        // Can only check for the axis if it was defined properly
        let direction = axis.direction;
        axis = this.pad.axis(axis.axis);
        if (axis === undefined || direction === undefined) return false;
            
        return this.axisThreshold <= axis * direction;
    };

    /**
     * Checks if a game key corresponding to an array of keys/button is being
     * pressed.
     * 
     * @param {GAMEPAD_KEY} key Game key to check.
     * @param {Array<Phaser.Keyboard|Phaser.Gamepad>} keyContainer List of 
     * buttons/keys to check.
     * @param {Function} checkFunc Function that checks if the key/button is 
     * being pressed.
     */
    _keyPressed(key, keyContainer, checkFunc) {
        if (!keyContainer || !keyContainer.hasOwnProperty(key)) return false;

        key = keyContainer[key];
        // If the key is not defined in the keymap assume it wasn't pressed
        if (!key) return false;
        // If it was defined, check for assigned keys/buttons
        for (let k in key) {
            k = key[k];
            if (checkFunc.call(this, k))
                return true;
        };

        return false;
    };

    /**
     * Indicates whether a keyboard key was just pressed.
     * 
     * @param {Phaser.Keyboard} key Phaser Keyboard key identifier.
     * @returns true if the key was just pressed.
     */ 
    _checkKeyJustPressed(key) {
        if (this.justPressed.keys[key]) {
            this.justPressed.keys[key] = false;
            return true;
        }

        return false;
    };

    /**
     * Indicates whether a controller button was just pressed.
     * 
     * @param {Phaser.Gamepad} button Phaser Gamepad button identifier.
     * @returns true if the gamepad is connected and the button was just 
     * pressed, false otherwise.
     */ 
    _checkButtonJustPressed(button) {
        if (!this.pad)
            return false;

        if (this.justPressed.buttons[button]) {
            this.justPressed.buttons[button] = false;
            return true;
        }

        return false;
    };

    /**
     * Indicates whether an axis was just activated within a threshold in the 
     * specified direction.
     * Axis input is interpreted as a discrete input based on axisThreshold.
     * 
     * @param {Object} axis Object containing the Phaser axis identifier and 
     * axis direction.
     * @param {Phaser.Gamepad} axis.axis Phaser axis identifier.
     * @param {Number} axis.direction 1/-1 indicating the axis direction.
     * @returns true if the gamepad is connected and the axis was just 
     * pressed, false otherwise.
     */ 
    _checkAxisJustPressed(axis) {
        if (!this.pad)
            return false;

        // Can only check for the axis if it was defined properly
        let direction = axis.direction;
        axis = axis.axis;
        if (axis === undefined || direction === undefined) return false;
        // Set axis direction
        if (direction === -1)
            axis = '-' + axis;

        if (this.justPressed.axes[axis]) {
            this.justPressed.axes[axis] = false;
            return true;
        }

        return false;
    };

    /**
     * Indicates whether a specific game key is being pressed.
     * 
     * @param {GAMEPAD_KEY} key Game key to check.
     * @returns true if the key is being held, false otherwise.
     */
    keyPressed(key) {
        // Keyboard keys
        if(this._keyPressed(key, this.keymap.keys, this._checkKeyPress))
            return true;
        // Buttons
        if(this._keyPressed(key, this.keymap.buttons, this._checkButtonPress))
            return true;
        // Axes
        if(this._keyPressed(key, this.keymap.axes, this._checkAxisPress))
            return true;
        
        return false;
    };

    /**
     * Indicates whether a game key was just pressed. A key that was just
     * pressed will only register as pressed once for every physical button 
     * press.
     * 
     * @param {GAMEPAD_KEY} key Game key to check.
     * @returns true if the key was just pressed, false otherwise.
     */
    keyJustPressed(key) {
        // Keyboard keys
        if(this._keyPressed(key, this.keymap.keys, this._checkKeyJustPressed))
            return true;
        // Buttons
        if(this._keyPressed(key, this.keymap.buttons, this._checkButtonJustPressed))
            return true;
        // Axes
        if(this._keyPressed(key, this.keymap.axes, this._checkAxisJustPressed))
            return true;
        
        return false;
    };
};

module.exports = {
    Gamepad: Gamepad,
}
