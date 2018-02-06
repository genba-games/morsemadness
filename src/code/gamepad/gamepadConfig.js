const GAMEPAD_KEY = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
    ACTION: 'action',
    INTERACT: 'interact',
    UPDOWN_AXIS: 'up_down_axis',
    LEFTRIGHT_AXIS: 'left_right_axis',
}

/**
 * List of available controller-specific keymap configurations.
 * Keymap configurations assign game keys to controller buttons.
 */
const KEYMAPS = {
    // Controllers
    HORI: 'HORI CO.,LTD. HORIPAD mini4 (Vendor: 0f0d Product: 00ee)',
    PS3XBOX360: 'PS3/XBOX360',
    // Keyboard
    KEYBOARDPLAYER1: 'pad1',
    KEYBOARDPLAYER2: 'pad2',
}

/**
 * Relates game keys to controller buttons for each keymap.
 */
const KEYMAP_KEYS = {
    [KEYMAPS.HORI]: {
        axes: {
            [GAMEPAD_KEY.UPDOWN_AXIS]: [
                Phaser.Gamepad.AXIS_1
            ],
            [GAMEPAD_KEY.LEFTRIGHT_AXIS]: [
                Phaser.Gamepad.AXIS_0
            ],
        },
        buttons: {
            [GAMEPAD_KEY.ACTION]: [
                Phaser.Gamepad.BUTTON_1,
            ],
            [GAMEPAD_KEY.INTERACT]: [
                Phaser.Gamepad.BUTTON_0,
                Phaser.Gamepad.BUTTON_3
            ]
        },
    },
    [KEYMAPS.PS3XBOX360]: {
        axes: {
            [GAMEPAD_KEY.UPDOWN_AXIS]: [
                Phaser.Gamepad.AXIS_1,
                Phaser.Gamepad.AXIS_7
            ],
            [GAMEPAD_KEY.LEFTRIGHT_AXIS]: [
                Phaser.Gamepad.AXIS_0,
                Phaser.Gamepad.AXIS_6
            ],
        },
        buttons: {
            [GAMEPAD_KEY.UP]: [
                Phaser.Gamepad.PS3XC_DPAD_UP,
            ],
            [GAMEPAD_KEY.DOWN]: [
                Phaser.Gamepad.PS3XC_DPAD_DOWN,
            ],
            [GAMEPAD_KEY.LEFT]: [
                Phaser.Gamepad.PS3XC_DPAD_LEFT,
            ],
            [GAMEPAD_KEY.RIGHT]: [
                Phaser.Gamepad.PS3XC_DPAD_RIGHT,
            ],
            [GAMEPAD_KEY.ACTION]: [
                Phaser.Gamepad.PS3XC_X,
            ],
            [GAMEPAD_KEY.INTERACT]: [
                Phaser.Gamepad.PS3XC_CIRCLE,
                Phaser.Gamepad.PS3XC_SQUARE
            ],
        },
    },
    [KEYMAPS.KEYBOARDPLAYER1]: {
        buttons: {
            [GAMEPAD_KEY.UP]: [
                Phaser.Keyboard.W,
            ],
            [GAMEPAD_KEY.DOWN]: [
                Phaser.Keyboard.S,
            ],
            [GAMEPAD_KEY.LEFT]: [
                Phaser.Keyboard.A,
            ],
            [GAMEPAD_KEY.RIGHT]: [
                Phaser.Keyboard.D,
            ],
            [GAMEPAD_KEY.ACTION]: [
                Phaser.Keyboard.Q,
            ],
            [GAMEPAD_KEY.INTERACT]: [
                Phaser.Keyboard.E,
            ],
        }
    },
    [KEYMAPS.KEYBOARDPLAYER2]: {
        buttons: {
            [GAMEPAD_KEY.UP]: [
                Phaser.Keyboard.I,
            ],
            [GAMEPAD_KEY.LEFT]: [
                Phaser.Keyboard.J,
            ],
            [GAMEPAD_KEY.DOWN]: [
                Phaser.Keyboard.K,
            ],
            [GAMEPAD_KEY.RIGHT]: [
                Phaser.Keyboard.L,
            ],
            [GAMEPAD_KEY.ACTION]: [
                Phaser.Keyboard.U,
            ],
            [GAMEPAD_KEY.INTERACT]: [
                Phaser.Keyboard.P,
            ],
        }
    }, 
}

module.exports = {
    GAMEPAD_KEY,
    KEYMAPS,
    KEYMAP_KEYS,
}