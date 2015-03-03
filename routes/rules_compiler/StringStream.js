"use strict";

class StringStream {
    constructor(str) {
        this.str = str;
        this.pos = 0;
    }

    next() {
        if (this.pos < this.str.length)
            return this.str[this.pos++];
        else
            return null;
    }

    poll() {
        if (this.pos < this.str.length)
            return this.str[this.pos];
        else
            return null;
    }
}

module.exports = StringStream;