"use strict";

class MagicArray extends Array {
    constructor(cb) {
        this.cb = cb || console.log.bind(console);
    }

    push() {
        this.cb.apply(this, arguments);
    }
}

module.exports = MagicArray;