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

    statement() {
        var oldToken = this.token;        
        var oldState = this.state;        
        
        this.token = this.lexer.getNextToken();
        this.state = this.getNextState(this.state, this.token.type);

        console.log("State: ", oldState);
        console.log("Token: ", oldToken);
        console.log("Next state: ", this.state);
        console.log("Next token: ", this.token);

        if (oldState == this.STATE.PROGRAM) {
            return {
                type: oldState,
                token: oldToken,
                op1: this.statement(),
                op2: this.statement()
            };
        }

        switch (this.state) {
            case this.STATE.OPERATION:
            case this.STATE.ASSIGN:
            case this.STATE.PARAM_AND:
            case this.STATE.ATTR_AND:
                return {
                    type: this.state,
                    token: this.token,
                    op1: {
                        type: oldState,
                        token: oldToken
                    },
                    op2: this.statement()
                };
            case this.STATE.ERROR:
                this.onError("ERROR_STATE");
                return null;
            case this.STATE.ATTR_VALUE:
            case this.STATE.PARAM_VALUE:
                return {
                    type: this.state,
                    token: this.token
                };
            default:
                if (this.state != this.STATE.END && this.state != this.STATE.THEN)
                    return {
                        type: oldState,
                        token: oldToken,
                        op1: this.statement()
                    };
                else
                    return {
                        type: oldState,
                        token: oldToken
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
                    case this.lexer.TYPE.THEN:
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
                    case this.lexer.TYPE.EOF:
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
        this.state = this.STATE.PROGRAM;
        this.token = null;

        return this.statement();
    }
}

module.exports = Parser;