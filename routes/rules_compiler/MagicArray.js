"use strict";

class MagicArray extends Array {
    MagicArray(cb) {
        this.cb = cb || console.log.bind(console);
    }

    push() {
        this.cb(arguments);
    }
}

module.exports = MagicArray;