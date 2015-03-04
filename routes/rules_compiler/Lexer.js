"use strict";
var _ = require('lodash');
var S = require('string');
S.extendPrototype();

class Lexer {
    /**
     * Lexical analyzer / tokenizer
     * @param stringStream {StringStream} data source
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

            AND: Symbol("AND"),

            EOF: Symbol("EOF")
        };

        this.KEY_WORDS = [
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

        this.CHAR_CLASS = {
            ALPHA: {
                type: Symbol('ALPHA'),
                domain: /[a-zа-я]/},
            NUMBER: {
                type: Symbol('NUMBER'),
                domain: /\d|\./},
            OPERATION: {
                type: Symbol('OPERATION'),
                domain: /=|>|<|!/},
            UNARY: {
                type: Symbol('UNARY'),
                domain: /-/},
            NULL: {
                type: Symbol('NULL'),
                domain: null},
            SPACE: {
                type: Symbol('SPACE'),
                domain: /\s/}
        };


        this.OPERATIONS = [
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

        this.STATE = {
            NONE: Symbol("NONE"),
            OPERATION: Symbol("OPERATION"),
            NUMBER: Symbol("NUMBER"),
            ALPHA: Symbol("ALPHA"),
            ALPHANUMERIC: Symbol("ALPHANUMERIC"),
            ERROR: Symbol("ERROR"),
            END: Symbol("END")
        };

        this.stringStream = stringStream;
        this.onError = onError;
    }



    getNextToken() {
        var token = {
            type: null,
            value: ""
        };

        var state = this.STATE.NONE;

        var ch = this.stringStream.next();
        while (state != this.STATE.END) {
            let charClass = this.getCharClass(ch);
            if (!charClass) {
                this.onError("Unknown character: " + ch);
                return null;
            }

            let nextState = this.getNextState(token, state, charClass);

            console.log("State: ", state.toString());
            console.log("Char: ", ch);
            console.log("Char class: ", charClass.type.toString());
            console.log("Next state: ", nextState.toString());
            console.log();

            state = nextState;

            if (state == this.STATE.ERROR) {
                this.onError("Unrecognized token:" + token.value);
                return null;
            }

            if (state != this.STATE.END) {
                token.value += ch;
                ch = this.stringStream.next();
            } else {
                // do not move stream unless ch is space
                if (this.CHAR_CLASS.SPACE.domain.test(ch))
                    this.stringStream.next();

                token.type = this.deduceTokenType(token);

                console.log("Token parsed: ", token);
                return token;
            }
        }
    }

    getCharClass(ch) {
        if (ch == null)
            return this.CHAR_CLASS.NULL;

        var charClass = _.find(this.CHAR_CLASS, function (classObject) {
            if (classObject.domain && classObject.domain.test(ch))
                return true;
        });

        return charClass;
    }

    getNextState(token, currentState, charClass) {
        switch (currentState) {
            case this.STATE.NONE:
                switch (charClass) {
                    case this.CHAR_CLASS.ALPHA:
                        return this.STATE.ALPHA;
                    case this.CHAR_CLASS.NUMBER:
                        return this.STATE.NUMBER;
                    case this.CHAR_CLASS.OPERATION:
                        return this.STATE.OPERATION;
                    case this.CHAR_CLASS.UNARY:
                        return this.STATE.NUMBER;
                    case this.CHAR_CLASS.NULL:
                        return this.STATE.END;
                    case this.CHAR_CLASS.SPACE:
                        return this.STATE.NONE;
                    default:
                        return this.STATE.ERROR;
                }
                break;

            case this.STATE.ALPHA:
                switch (charClass) {
                    case this.CHAR_CLASS.ALPHA:
                        return this.STATE.ALPHA;
                    case this.CHAR_CLASS.NUMBER:
                        return this.STATE.NUMBER;
                    case this.CHAR_CLASS.OPERATION:
                        return this.STATE.END;
                    case this.CHAR_CLASS.UNARY:
                        return this.STATE.ERROR;
                    case this.CHAR_CLASS.NULL:
                        return this.STATE.END;
                    case this.CHAR_CLASS.SPACE:
                        return this.STATE.END;
                    default:
                        return this.STATE.ERROR;
                }
                break;

            case this.STATE.NUMBER:
                switch (charClass) {
                    case this.CHAR_CLASS.ALPHA:
                        return this.STATE.ERROR;
                    case this.CHAR_CLASS.NUMBER:
                        return this.STATE.NUMBER;
                    case this.CHAR_CLASS.OPERATION:
                        return this.STATE.END;
                    case this.CHAR_CLASS.UNARY:
                        return this.STATE.ERROR;
                    case this.CHAR_CLASS.NULL:
                        return this.STATE.END;
                    case this.CHAR_CLASS.SPACE:
                        return this.STATE.END;
                    default:
                        return this.STATE.ERROR;
                }
                break;

            case this.STATE.ALPHANUMERIC:
                switch (charClass) {
                    case this.CHAR_CLASS.ALPHA:
                        return this.STATE.ALPHANUMERIC;
                    case this.CHAR_CLASS.NUMBER:
                        return this.STATE.ALPHANUMERIC;
                    case this.CHAR_CLASS.OPERATION:
                        return this.STATE.END;
                    case this.CHAR_CLASS.UNARY:
                        return this.STATE.ERROR;
                    case this.CHAR_CLASS.NULL:
                        return this.STATE.END;
                    case this.CHAR_CLASS.SPACE:
                        return this.STATE.END;
                    default:
                        return this.STATE.ERROR;
                }
                break;

            case this.STATE.OPERATION:
                switch (charClass) {
                    case this.CHAR_CLASS.ALPHA:
                        return this.STATE.END;
                    case this.CHAR_CLASS.NUMBER:
                        return this.STATE.END;
                    case this.CHAR_CLASS.OPERATION:
                        return this.STATE.OPERATION;
                    case this.CHAR_CLASS.UNARY:
                        return this.STATE.END;
                    case this.CHAR_CLASS.NULL:
                        return this.STATE.END;
                    case this.CHAR_CLASS.SPACE:
                        return this.STATE.END;
                    default:
                        return this.STATE.ERROR;
                }
                break;

            case this.STATE.ERROR:
                return this.STATE.ERROR;

            case this.STATE.END:
                return this.STATE.ERROR;
        }
    }

    deduceTokenType(token) {
        if (token.value == "")
            return this.TYPE.EOF;

        if (_.isNumber(token.value)) {
            return this.TYPE.NUMBER;
        }

        var op = _.find(this.OPERATIONS, {value: token.value});
        if (op) {
            return op.type;
        }

        var keyWord = _.find(this.KEY_WORDS, {value: token.value});
        if (keyWord) {
            return keyWord.type;
        }

        return this.TYPE.IDENTIFIER;
    }
}

module.exports = Lexer;