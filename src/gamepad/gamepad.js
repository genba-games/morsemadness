    var GAMEPAD_KEY = {
        UP: 'up',
        DOWN: 'down',
        LEFT: 'left',
        RIGHT: 'right',
        ACTION: 'action',
    }

    /**
     * This keymap is assigned to any new Gamepad that does not define a keymap.
     * Console neutral, PS3XC and XBOX360 buttons are all the same. They are 
     * used to make bindings simpler to configure for developers.
     */
    var defaultKeymap = {
        [GAMEPAD_KEY.UP]: [
            Phaser.Keyboard.W,
            Phaser.Keyboard.UP,
            Phaser.Gamepad.PS3XC_DPAD_UP,
        ],
        [GAMEPAD_KEY.DOWN]: [
            Phaser.Keyboard.S,
            Phaser.Keyboard.DOWN,
            Phaser.Gamepad.PS3XC_DPAD_DOWN,
        ],
        [GAMEPAD_KEY.LEFT]: [
            Phaser.Keyboard.A,
            Phaser.Keyboard.LEFT,
            Phaser.Gamepad.PS3XC_DPAD_LEFT,
        ],
        [GAMEPAD_KEY.RIGHT]: [
            Phaser.Keyboard.D,
            Phaser.Keyboard.RIGHT,
            Phaser.Gamepad.PS3XC_DPAD_RIGHT,
        ],
        [GAMEPAD_KEY.ACTION]: [
            Phaser.Keyboard.X,
            Phaser.Keyboard.SPACE,
            Phaser.Gamepad.PS3XC_X,
        ],
    }

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
        key = keymap[key];
        // Check if key was processed by Phaser
        if (key === true || key === false)  
            return key;
        // If it wasn't, check for assigned keys
        for (let k in key) {
            k = key[k];
            if (game.input.keyboard.isDown(k)
                || (this.pad && this.pad.isDown(k)) )
                return true;
        }
        return false;
    }
    
    /**
     * Creates a new gamepad with the specified keys for a player.
     * 
     * @param {Player} player Player instance to be assigned to the new gamepad.
     * @param {Object} keymap Object containing the appropriate 
     * ``GAMEPAD_KEY``:[``Phaser.Keyboard``] configuration pairs. This is 
     * typically the controller assigned to the player.
     * @param {Phaser.Gamepad} [gamepad] Optional gamepad to assign to the 
     * player.
     */
    function Gamepad(player, keymap, gamepad) {
        this.player = player;
        this.keymap = keymap || defaultKeymap;
        this.pad = gamepad;
    
        this._keyPressed = keyPressed
        this.keyPressed = function(key){
            return this._keyPressed(this.keymap, key);
        }
    };

module.exports = {
    GAMEPAD_KEY: GAMEPAD_KEY,
    Gamepad: Gamepad,
}
