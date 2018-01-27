

    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    gamepad = {
        UP: 'up',
        DOWN: 'down',
        LEFT: 'left',
        RIGHT: 'right',
        ACTION: 'action',
    }
    defaultKeymap = {
        [gamepad.UP]: [
            Phaser.Keyboard.W,
            Phaser.Keyboard.UP
        ],
        [gamepad.DOWN]: [
            Phaser.Keyboard.S,
            Phaser.Keyboard.DOWN
        ],
        [gamepad.LEFT]: [
            Phaser.Keyboard.A,
            Phaser.Keyboard.LEFT
        ],
        [gamepad.RIGHT]: [
            Phaser.Keyboard.D,
            Phaser.Keyboard.RIGHT
        ],
        [gamepad.ACTION]: [
            Phaser.Keyboard.X
        ],
        [gamepad.JUMP]: [
            Phaser.Keyboard.SPACEBAR,
            Phaser.Keyboard.Z
        ]
    }
    
    /**
     * Indicates whether a key assigned to a specific controller key is being 
     * pressed. 
     * Controller keys correspond to the keys of ``controllersKeys`` object.
     * 
     * @param {Object} keymap Object containing the appropriate 
     * ``controllerKey``:[``Phaser.Keyboard``] configuration pairs.
     * @param {controllerKey} key Controller key to check.
     * @returns true if the key is being held, false otherwise.
     */
    function keyPressed(keymap, key) {
        key = keymap[key];
        if (key === true) return true;
        if (key === false) return false;
        for (i in key)
            if (game.input.keyboard.isDown(key[i]))
                return true;
        return false;
    }
    
    /**
     * Controls an assigned player.
     * 
     * @param {Player} player Player instance to assign to controller.
     * @param {Object} keymap Object containing the appropriate 
     * ``controllerKey``:[``Phaser.Keyboard``] configuration pairs.
     */
    function Controller(player, keymap) {
        this.player = player;
        this.keymap = keymap || defaultKeymap;
        // Initialize ComboChecker
        this.comboChecker = ComboChecker(this);
    
        this._keyPressed = keyPressed
        this.keyPressed = function(key){
            return this._keyPressed(this.keymap, key);
        }
    };