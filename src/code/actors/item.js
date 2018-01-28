import Actor from './actor'
var randomObjProp = require('random-obj-prop')

/**
 * Types of items.
 */
var ITEM_TYPE = {
  ONE: {
    graphics: '',
    graphicsPath: '',
  },
  TWO: {
    graphics: '',
    graphicsPath: '',
  },
  THREE: {
    graphics: '',
    graphicsPath: '',
  },
}

/**
 * Generates a random type of item. Item types are defined in ITEM_TYPE.
 */
function getRandomItem() {
  return randomObjProp(ITEM_TYPE); 
}

class Item extends Actor {
  collide(target) {
    // Affect target here

    // Destroy the item
    this.kill();
  }
}

/**
 * Creates an item in the specified coordinates.
 * @param {Phaser.Group} group Item group.
 * @param {Number} x Horizontal position.
 * @param {Number} y Vertical position.
 * @param {ITEM_TYPE} itemType Item type. If this parameter is not defined a
 * random type of item will be generated.
 */
function itemFactory(group, x, y, itemType) {
  x = x * config.tileWidth;
  y = y * config.tileHeight;

  // Resolve item type
  itemType = itemType || getRandomItemType();

  group.add(new Item(group.game, x, y, itemType.graphics));
}

module.exports = {
  itemFactory,
  ITEM_TYPE,
}