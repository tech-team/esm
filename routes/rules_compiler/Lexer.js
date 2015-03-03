"use strict";
var _ = require('lodash');
var S = require('string');
S.extendPrototype();

class Lexer {
    /**
     * Lexical analyzer / tokenizer
     * @param stringStream {StringStream} data source
     * @param onError {Function} callback
     */
    constructor(stringStream, onError) {
        this.TYPE = {
            NUMBER: Symbol("NUMBER"),
            IDENTIFIER: Symbol("IDENTIFIER"),
            IF: Symbol("IF"),
            THEN: Symbol("THEN"),

            EQUAL: Symbol("EQUAL"),
            LESS: Symbol("LESS"),
            MORE: Symbol("MORE"),
            NOT_EQUAL: Symbol("NOT_EQUAL"),

            AND: Symbol("AND")
        };

        this.WORDS = [
            {
                value: "если",
                type: this.TYPE.IF
            },
            {
                value: "то",
                type: this.TYPE.THEN
            },
            {
                value: "и",
                type: this.TYPE.AND
            }
        ];

        this.OPERATORS = [
            {
                value: "=",
                type: this.TYPE.EQUAL
            },
            {
                value: "<",
                type: this.TYPE.LESS
            },
            {
                value: ">",
                type: this.TYPE.MORE
            },
            {
                value: "!=",
                type: this.TYPE.NOT_EQUAL
            }
        ];

        this.SYMBOLS = ['>', '<', '=', '!'];

        this.stringStream = stringStream;
        this.onError = onError;
    }

    getNextToken() {
        var token = {
            type: null,
            value: ""
        };

        var ch = this.stringStream.poll();
        while (true) {
            if (ch == null) {
                if (token.value != "") {
                    this.analyzeToken(token);
                    return token;
                } else {
                    return null;
                }
            }

            ch = ch.toLowerCase();
            if (Lexer.isAlpha(ch)) {
                let op = _.find(this.OPERATORS, {value: token.value});
                if (op) {
                    token.type = op.type;
                    return token;
                }

                token.value += ch;
                this.stringStream.next();
            } else if (Lexer.isNumber(ch)) {
                let op = _.find(this.OPERATORS, {value: token.value});
                if (op) {
                    token.type = op.type;
                    return token;
                }

                if (Lexer.isAlpha(token.value))
                    token.type = this.TYPE.IDENTIFIER;
                else
                    token.type = this.TYPE.NUMBER;

                token.value += ch;
                this.stringStream.next();
            } else if (ch == ' ') {
                if (token.value != "") {
                    this.analyzeToken(token);
                    this.stringStream.next();
                    return token;
                }
            } else if (_.contains(this.SYMBOLS, ch)) {
                if (token.value != "") {
                    // will work for operations of length 1 and 2
                    if (_.contains(this.SYMBOLS, token.value)) {
                        token.value += ch;
                        this.stringStream.next();
                    }

                    this.analyzeToken(token);
                    // do not call next here
                    // we will need that ch as part of next token

                    return token;
                } else {
                    // begin of operation
                    token.value += ch;
                    this.stringStream.next();
                }
            } else {
                this.onError("Unrecognized token: " + token.value);
            }

            ch = this.stringStream.poll();
        }

        return null; //EOF
    }

    analyzeToken(token) {
        if (token.type)  // if token type already deduced
            return;

        var word = _.find(this.WORDS, {value: token.value});
        if (word) {
            token.type = word.type;
        } else if (word = _.find(this.OPERATORS, {value: token.value})) {
            token.type = word.type;
        } else {
            token.type = this.TYPE.IDENTIFIER;
        }
    }

    static isAlpha(str) {
        return /^[a-zа-я]+$/i.test(str);
    }

    static isNumber(str) {
        return /^[0-9]+$/.test(str);
    }
}

module.exports = Lexer;