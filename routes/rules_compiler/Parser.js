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

        this.TYPE = {
            PROGRAM: Symbol("PROGRAM"),

            IF: Symbol("IF"),
            PARAM_NAME: Symbol("PARAM_NAME"),
            PARAM_VALUE: Symbol("PARAM_VALUE"),
            OPERATION: Symbol("OPERATION"),

            THEN: Symbol("THEN"),
            ATTR_NAME: Symbol("ATTR_NAME"),
            ATTR_VALUE: Symbol("ATTR_VALUE"),
            ASSIGN: Symbol("ASSIGN"),

            AND: Symbol("AND"),

            ERROR: Symbol("ERROR"),
            END: Symbol("END")
        };
    }

    condition() {
        var token = this.nextToken();

        if (token.type != this.lexer.TYPE.IF) {
            this.onError("IF expected, got " + token.type.toString());
            return null;
        }

        return {
            type: this.TYPE.IF,
            token: token,
            op1: this.params()
        };
    }

    consequence() {
        var token = this.getToken();

        if (token.type != this.lexer.TYPE.THEN) {
            this.onError("THEN expected, got " + token.type.toString());
            return null;
        }

        return {
            type: this.TYPE.THEN,
            token: token,
            op1: this.attributes()
        };
    }

    params() {
        var params = [this.param()];

        while(true) {
            var andToken = this.nextToken();
            if (andToken.type != this.lexer.TYPE.AND && andToken.type != this.lexer.TYPE.THEN) {
                this.onError("AND or THEN expected, got " + andToken.type.toString());
                return null;
            }

            if (andToken.type == this.lexer.TYPE.THEN)
                return {
                    type: this.TYPE.AND,
                    token: {type: this.lexer.TYPE.AND},
                    params: params
                };

            params.push(this.param());
        }
    }

    attributes() {
        var attributes = [this.attribute()];

        while(true) {
            var andToken = this.nextToken();
            if (andToken.type != this.lexer.TYPE.AND && andToken.type != this.lexer.TYPE.EOF) {
                this.onError("AND or EOF expected, got " + andToken.type.toString());
                return null;
            }

            if (andToken.type == this.lexer.TYPE.EOF)
                return {
                    type: this.TYPE.AND,
                    token: {type: this.lexer.TYPE.AND},
                    attributes: attributes
                };

            attributes.push(this.attribute());
        }
    }

    param() {
        var param = this.nextToken();
        if (param.type != this.lexer.TYPE.IDENTIFIER) {
            this.onError("PARAM_NAME expected, got " + param.type.toString());
            return null;
        }

        var operation = this.nextToken();
        if (this.lexer.isOperation(param.type)) {
            this.onError("OPERATION expected, got " + operation.type.toString());
            return null;
        }

        var value = this.nextToken();
        if (value.type != this.lexer.TYPE.IDENTIFIER && value.type != this.lexer.TYPE.NUMBER) {
            this.onError("PARAM_VALUE expected, got " + value.type.toString());
            return null;
        }

        return {
            type: this.TYPE.OPERATION,
            token: operation,
            op1: {
                type: this.TYPE.PARAM_NAME,
                token: param
            },
            op2: {
                type: this.TYPE.PARAM_VALUE,
                token: value
            }
        };
    }

    attribute() {
        var attr = this.nextToken();
        if (attr.type != this.lexer.TYPE.IDENTIFIER) {
            this.onError("ATTR_NAME expected, got " + attr.type.toString());
            return null;
        }

        var assign = this.nextToken();
        if (attr.type == this.lexer.TYPE.ASSIGN) {
            this.onError("ASSIGN expected, got " + assign.type.toString());
            return null;
        }

        var value = this.nextToken();
        if (value.type != this.lexer.TYPE.IDENTIFIER && value.type != this.lexer.TYPE.NUMBER) {
            this.onError("ATTR_VALUE expected, got " + value.type.toString());
            return null;
        }

        return {
            type: this.TYPE.ASSIGN,
            token: assign,
            op1: {
                type: this.TYPE.ATTR_NAME,
                token: attr
            },
            op2: {
                type: this.TYPE.ATTR_VALUE,
                token: value
            }
        };
    }

    getToken() {
        return this.token;
    }

    nextToken() {
        this.token = this.lexer.getNextToken();
        return this.token;
    }

    /**
     * Main Parser's method
     * @returns {Object|null}
     */
    parse() {
        var program = {
            type: this.TYPE.PROGRAM,
            token: null,
            op1: this.condition(),
            op2: this.consequence()
        };

        return program;
    }
}

module.exports = Parser;