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

        this.STATE = {
            PROGRAM: Symbol("PROGRAM"),

            IF: Symbol("IF"),
            PARAM_NAME: Symbol("PARAM_NAME"),
            PARAM_VALUE: Symbol("PARAM_VALUE"),
            OPERATION: Symbol("OPERATION"),

            THEN: Symbol("THEN"),
            ATTR_NAME: Symbol("ATTR_NAME"),
            ATTR_VALUE: Symbol("ATTR_VALUE"),
            ASSIGN: Symbol("ASSIGN"),

            PARAM_AND: Symbol("PARAM_AND"),
            ATTR_AND: Symbol("ATTR_AND"),

            ERROR: Symbol("ERROR"),
            END: Symbol("END")
        };
    }

    //TODO
    statement(state, token) {
        var nextToken = this.lexer.getNextToken();
        var nextState = this.getNextState(state, token.type);

        switch (state) {
            case this.STATE.OPERATION:
            case this.STATE.ASSIGN:
                return {
                    type: state,
                    token: token,
                    op1: statement(nextState, nextToken),
                    op2: statement(nextState, nextToken)
                };
            case this.STATE.ERROR:
                return null;
            default:
                return {
                    type: state,
                    token: token,
                    op1: statement(nextState, nextToken)
                };
        }
    }

    getNextState(state, tokenType) {
        switch (state) {
            case this.STATE.PROGRAM:
                switch (tokenType) {
                    case this.lexer.TYPE.IF:
                        return this.STATE.IF;
                    default:
                        this.onError("IF expected");
                        return this.STATE.ERROR;
                }
            case this.STATE.IF:
                switch (tokenType) {
                    case this.lexer.TYPE.IDENTIFIER:
                        return this.STATE.PARAM_NAME;
                    default:
                        this.onError("PARAM_NAME expected");
                        return this.STATE.ERROR;
                }
            case this.STATE.PARAM_NAME:
                switch (tokenType) {
                    case this.lexer.TYPE.EQUAL:
                    case this.lexer.TYPE.LESS:
                    case this.lexer.TYPE.LESS_OR_EQUAL:
                    case this.lexer.TYPE.MORE:
                    case this.lexer.TYPE.MORE_OR_EQUAL:
                    case this.lexer.TYPE.NOT_EQUAL:
                        return this.STATE.OPERATION;
                    default:
                        this.onError("OPERATION expected");
                        return this.STATE.ERROR;
                }
            case this.STATE.OPERATION:
                switch (tokenType) {
                    case this.lexer.TYPE.IDENTIFIER:
                        return this.STATE.PARAM_VALUE;
                    default:
                        this.onError("PARAM_VALUE expected");
                        return this.STATE.ERROR;
                }
            case this.STATE.PARAM_VALUE:
                switch (tokenType) {
                    case this.lexer.TYPE.AND:
                        return this.STATE.PARAM_AND;
                    case this.lexer.THEN:
                        return this.STATE.THEN;
                    default:
                        this.onError("AND or THEN expected");
                        return this.STATE.ERROR;
                }
            case this.STATE.PARAM_AND:
                switch (tokenType) {
                    case this.lexer.TYPE.IDENTIFIER:
                        return this.STATE.PARAM_NAME;
                    default:
                        this.onError("PARAM_NAME expected");
                        return this.STATE.ERROR;
                }
            case this.STATE.THEN:
                switch (tokenType) {
                    case this.lexer.TYPE.IDENTIFIER:
                        return this.STATE.ATTR_NAME;
                    default:
                        this.onError("ATTR_NAME expected");
                        return this.STATE.ERROR;
                }
            case this.STATE.ATTR_NAME:
                switch (tokenType) {
                    case this.lexer.TYPE.ASSIGN:
                        return this.STATE.ASSIGN;
                    default:
                        this.onError("ASSIGN expected");
                        return this.STATE.ERROR;
                }
            case this.STATE.ASSIGN:
                switch (tokenType) {
                    case this.lexer.TYPE.IDENTIFIER:
                        return this.STATE.ATTR_VALUE;
                    default:
                        this.onError("ATTR_VALUE expected");
                        return this.STATE.ERROR;
                }
            case this.STATE.ATTR_VALUE:
                switch (tokenType) {
                    case this.lexer.TYPE.AND:
                        return this.STATE.ATTR_AND;
                    case this.lexer.EOF:
                        return this.STATE.END;
                    default:
                        this.onError("AND or EOF expected");
                        return this.STATE.ERROR;
                }
            case this.STATE.ATTR_AND:
                switch (tokenType) {
                    case this.lexer.TYPE.IDENTIFIER:
                        return this.STATE.ATTR_NAME;
                    default:
                        this.onError("ATTR_NAME expected");
                        return this.STATE.ERROR;
                }
            default:
                this.onError("Unsupported state: ", state);
                return this.STATE.ERROR;
        }
    }

    /**
     * Main Parser's method
     * @returns {node|null}
     */
    parse() {
        var state = this.STATE.PROGRAM;
        var nextToken = this.lexer.getNextToken();

        var node = {
            type: state,
            token: null,
            op1: this.statement(this.getNextState(state, nextToken), nextToken)
        };

        return node;
    }
}

module.exports = Parser;