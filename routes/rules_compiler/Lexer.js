"use strict";
var _ = require('lodash');

class Lexer {
    /**
     * Lexical analyzer / tokenizer
     * @param stringStream {StringStream} data source
     * @param errorsList {Array}
     */
    constructor(stringStream, errorsList) {
        this.stringStream = stringStream;
        this.errorsList = errorsList;
    }

    getNextToken() {
        var token = {
            type: null,
            value: ""
        };

        var state = Lexer.STATE.NONE;

        var ch = this.stringStream.poll();
        while (state != Lexer.STATE.END) {
            ch = this.stringStream.poll();

            let charClass = this.getCharClass(ch);
            if (!charClass) {
                this.errorsList.push("Unknown character: " + ch);
                return null;
            }

            let nextState = this.getNextState(state, charClass);

            //console.log("State: ", state.toString());
            //console.log("Char: ", ch);
            //console.log("Char class: ", charClass.type.toString());
            //console.log("Next state: ", nextState.toString());
            //console.log();

            if (nextState == Lexer.STATE.ERROR) {
                this.errorsList.push("Unrecognized token:" + token.value);
                return null;
            }

            if (nextState != Lexer.STATE.END) {
                // ignore leading space
                if (!Lexer.CHAR_CLASS.SPACE.domain.test(ch))
                    token.value += ch;

                ch = this.stringStream.next();
            } else {
                // do not move stream unless ch is space
                if (Lexer.CHAR_CLASS.SPACE.domain.test(ch))
                    this.stringStream.next();

                token.type = this.deduceTokenType(state, token);

                //console.log("Token parsed: ", token);
                return token;
            }

            state = nextState;
        }
    }

    getCharClass(ch) {
        if (ch == null)
            return Lexer.CHAR_CLASS.NULL;

        ch = ch.toLowerCase();

        var charClass = _.find(Lexer.CHAR_CLASS, function (classObject) {
            if (classObject.domain && classObject.domain.test(ch))
                return true;
        });

        return charClass;
    }

    getNextState(currentState, charClass) {
        switch (currentState) {
            case Lexer.STATE.NONE:
                switch (charClass) {
                    case Lexer.CHAR_CLASS.ALPHA:
                        return Lexer.STATE.ALPHA;
                    case Lexer.CHAR_CLASS.NUMBER:
                        return Lexer.STATE.NUMBER;
                    case Lexer.CHAR_CLASS.OPERATION:
                        return Lexer.STATE.OPERATION;
                    case Lexer.CHAR_CLASS.UNARY:
                        return Lexer.STATE.NUMBER;
                    case Lexer.CHAR_CLASS.NULL:
                        return Lexer.STATE.END;
                    case Lexer.CHAR_CLASS.SPACE:
                        return Lexer.STATE.NONE;
                    default:
                        return Lexer.STATE.ERROR;
                }
                break;

            case Lexer.STATE.ALPHA:
                switch (charClass) {
                    case Lexer.CHAR_CLASS.ALPHA:
                        return Lexer.STATE.ALPHA;
                    case Lexer.CHAR_CLASS.NUMBER:
                        return Lexer.STATE.ALPHANUMERIC;
                    case Lexer.CHAR_CLASS.OPERATION:
                        return Lexer.STATE.END;
                    case Lexer.CHAR_CLASS.UNARY:
                        return Lexer.STATE.ERROR;
                    case Lexer.CHAR_CLASS.NULL:
                        return Lexer.STATE.END;
                    case Lexer.CHAR_CLASS.SPACE:
                        return Lexer.STATE.END;
                    default:
                        return Lexer.STATE.ERROR;
                }
                break;

            case Lexer.STATE.NUMBER:
                switch (charClass) {
                    case Lexer.CHAR_CLASS.ALPHA:
                        return Lexer.STATE.ERROR;
                    case Lexer.CHAR_CLASS.NUMBER:
                        return Lexer.STATE.NUMBER;
                    case Lexer.CHAR_CLASS.OPERATION:
                        return Lexer.STATE.END;
                    case Lexer.CHAR_CLASS.UNARY:
                        return Lexer.STATE.ERROR;
                    case Lexer.CHAR_CLASS.NULL:
                        return Lexer.STATE.END;
                    case Lexer.CHAR_CLASS.SPACE:
                        return Lexer.STATE.END;
                    default:
                        return Lexer.STATE.ERROR;
                }
                break;

            case Lexer.STATE.ALPHANUMERIC:
                switch (charClass) {
                    case Lexer.CHAR_CLASS.ALPHA:
                        return Lexer.STATE.ALPHANUMERIC;
                    case Lexer.CHAR_CLASS.NUMBER:
                        return Lexer.STATE.ALPHANUMERIC;
                    case Lexer.CHAR_CLASS.OPERATION:
                        return Lexer.STATE.END;
                    case Lexer.CHAR_CLASS.UNARY:
                        return Lexer.STATE.ERROR;
                    case Lexer.CHAR_CLASS.NULL:
                        return Lexer.STATE.END;
                    case Lexer.CHAR_CLASS.SPACE:
                        return Lexer.STATE.END;
                    default:
                        return Lexer.STATE.ERROR;
                }
                break;

            case Lexer.STATE.OPERATION:
                switch (charClass) {
                    case Lexer.CHAR_CLASS.ALPHA:
                        return Lexer.STATE.END;
                    case Lexer.CHAR_CLASS.NUMBER:
                        return Lexer.STATE.END;
                    case Lexer.CHAR_CLASS.OPERATION:
                        return Lexer.STATE.OPERATION;
                    case Lexer.CHAR_CLASS.UNARY:
                        return Lexer.STATE.END;
                    case Lexer.CHAR_CLASS.NULL:
                        return Lexer.STATE.END;
                    case Lexer.CHAR_CLASS.SPACE:
                        return Lexer.STATE.END;
                    default:
                        return Lexer.STATE.ERROR;
                }
                break;

            case Lexer.STATE.ERROR:
                return Lexer.STATE.ERROR;

            case Lexer.STATE.END:
                return Lexer.STATE.ERROR;
        }
    }

    deduceTokenType(state, token) {
        switch (state) {
            case Lexer.STATE.NONE:
                return Lexer.TYPE.EOF;
            case Lexer.STATE.NUMBER:
                token.value = parseFloat(token.value);
                return Lexer.TYPE.NUMBER;
            default: {
                var op = _.find(Lexer.OPERATIONS, function (opObject) {
                    var values = opObject.values;
                    return _.contains(values, token.value);
                });
                if (op) {
                    return op.type;
                }

                var keyWord = _.find(Lexer.KEY_WORDS, function (kwObject) {
                    var values = kwObject.values;
                    return _.contains(values, token.value);
                });
                if (keyWord) {
                    return keyWord.type;
                }
            }
        }

        return Lexer.TYPE.IDENTIFIER;
    }

    isOperation(tokenType) {
        return _.contains(Lexer.OPERATIONS, {type: tokenType}) &&
            tokenType != Lexer.OPERATIONS.ASSIGN;
    }
}


//sych static, very ES6
Lexer.TYPE = {
    NUMBER: Symbol("NUMBER"),
    IDENTIFIER: Symbol("IDENTIFIER"),
    IF: Symbol("IF"),
    THEN: Symbol("THEN"),

    EQUAL: Symbol("EQUAL"),
    LESS: Symbol("LESS"),
    LESS_OR_EQUAL: Symbol("LESS_OR_EQUAL"),
    MORE: Symbol("MORE"),
    MORE_OR_EQUAL: Symbol("MORE_OR_EQUAL"),
    NOT_EQUAL: Symbol("NOT_EQUAL"),

    ASSIGN: Symbol("ASSIGN"),

    AND: Symbol("AND"),

    EOF: Symbol("EOF")
};

Lexer.KEY_WORDS = [
    {
        values: ["if", "если", "коли", "ежели"],
        type: Lexer.TYPE.IF
    },
    {
        values: ["then", "то", "следовательно"],
        type: Lexer.TYPE.THEN
    },
    {
        values: ["and", "и"],
        type: Lexer.TYPE.AND
    }
];

Lexer.CHAR_CLASS = {
    ALPHA: {
        type: Symbol('ALPHA'),
        domain: /[a-zа-я_]/},
    NUMBER: {
        type: Symbol('NUMBER'),
        domain: /\d|\./},
    OPERATION: {
        type: Symbol('OPERATION'),
        domain: /[=><!]/},
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


Lexer.OPERATIONS = [
    {
        values: ["==", "equals", "equal", "равно", "равен", "является"],
        type: Lexer.TYPE.EQUAL
    },
    {
        values: ["<", "less", "меньше"],
        type: Lexer.TYPE.LESS
    },
    {
        values: ["<="],
        type: Lexer.TYPE.LESS_OR_EQUAL
    },
    {
        values: [">", "more", "больше"],
        type: Lexer.TYPE.MORE
    },
    {
        values: [">="],
        type: Lexer.TYPE.MORE_OR_EQUAL
    },
    {
        values: ["!=", "not_equal", "не_равно", "не_равен"],
        type: Lexer.TYPE.NOT_EQUAL
    },
    {
        values: ["=", "set", "assign", "присвоить", "будет"],
        type: Lexer.TYPE.ASSIGN
    }
];

Lexer.STATE = {
    NONE: Symbol("NONE"),
    OPERATION: Symbol("OPERATION"),
    NUMBER: Symbol("NUMBER"),
    ALPHA: Symbol("ALPHA"),
    ALPHANUMERIC: Symbol("ALPHANUMERIC"),
    ERROR: Symbol("ERROR"),
    END: Symbol("END")
};


module.exports = Lexer;