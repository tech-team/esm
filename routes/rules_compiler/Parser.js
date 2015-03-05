"use strict";
var _ = require('lodash');

class Parser {
    /**
     * Parser
     * @param lexer {Lexer} data source
     * @param onError {Function} callback
     */
    constructor(lexer, onError) {
        this.lexer = lexer;
        this.onError = onError;

        this.NODE = {
            PROGRAM: Symbol('PROGRAM'),

        };
    }

    //TODO
    statement(token) {
        return token;
    }

    /**
     * Main Parser's method
     * @returns {node|null}
     */
    parse() {
        var token = this.lexer.getNextToken();
        var node = {
            type: this.NODE.PROGRAM,
            op1: this.statement(token)
        };

        if (token.type != this.lexer.TYPE.EOF) {
            this.onError("Invalid statement syntax");
            return null;
        }
    }
}

module.exports = Parser;