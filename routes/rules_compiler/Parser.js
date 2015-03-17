"use strict";
var _ = require('lodash');
var Lexer = require('./Lexer');

class Parser {
    /**
     * Parser
     * @param lexer {Lexer} data source
     * @param errorsList {Function} callback
     */
    constructor(lexer, errorsList) {
        this.lexer = lexer;
        this.errorsList = errorsList;
    }

    condition() {
        var token = this.nextToken();

        if (token.type != Lexer.TYPE.IF) {
            this.errorsList.push("IF expected, got " + token.type.toString());
            return null;
        }

        return {
            type: Parser.TYPE.IF,
            token: token,
            op1: this.params()
        };
    }

    consequence() {
        var token = this.getToken();

        if (token.type != Lexer.TYPE.THEN) {
            this.errorsList.push("THEN expected, got " + token.type.toString());
            return null;
        }

        return {
            type: Parser.TYPE.THEN,
            token: token,
            op1: this.attributes()
        };
    }

    params() {
        var params = [this.param()];

        while(true) {
            var andToken = this.nextToken();
            if (andToken.type != Lexer.TYPE.AND && andToken.type != Lexer.TYPE.THEN) {
                this.errorsList.push("AND or THEN expected, got " + andToken.type.toString());
                return null;
            }

            if (andToken.type == Lexer.TYPE.THEN)
                return {
                    type: Parser.TYPE.AND,
                    token: {type: Lexer.TYPE.AND},
                    params: params
                };

            params.push(this.param());
        }
    }

    attributes() {
        var attributes = [this.attribute()];

        while(true) {
            var andToken = this.nextToken();
            if (andToken.type != Lexer.TYPE.AND && andToken.type != Lexer.TYPE.EOF) {
                this.errorsList.push("AND or EOF expected, got " + andToken.type.toString());
                return null;
            }

            if (andToken.type == Lexer.TYPE.EOF)
                return {
                    type: Parser.TYPE.AND,
                    token: {type: Lexer.TYPE.AND},
                    attributes: attributes
                };

            attributes.push(this.attribute());
        }
    }

    param() {
        var param = this.nextToken();
        if (param.type != Lexer.TYPE.IDENTIFIER) {
            this.errorsList.push("PARAM_NAME expected, got " + param.type.toString());
            return null;
        }

        var operation = this.nextToken();
        if (this.lexer.isOperation(param.type)) {
            this.errorsList.push("OPERATION expected, got " + operation.type.toString());
            return null;
        }

        var value = this.nextToken();
        if (value.type != Lexer.TYPE.IDENTIFIER && value.type != Lexer.TYPE.NUMBER) {
            this.errorsList.push("PARAM_VALUE expected, got " + value.type.toString());
            return null;
        }

        return {
            type: Parser.TYPE.OPERATION,
            token: operation,
            op1: {
                type: Parser.TYPE.PARAM_NAME,
                token: param
            },
            op2: {
                type: Parser.TYPE.PARAM_VALUE,
                token: value
            }
        };
    }

    attribute() {
        var attr = this.nextToken();
        if (attr.type != Lexer.TYPE.IDENTIFIER) {
            this.errorsList.push("ATTR_NAME expected, got " + attr.type.toString());
            return null;
        }

        var assign = this.nextToken();
        if (assign.type != Lexer.TYPE.ASSIGN) {
            this.errorsList.push("ASSIGN expected, got " + assign.type.toString());
            return null;
        }

        var value = this.nextToken();
        if (value.type != Lexer.TYPE.IDENTIFIER && value.type != Lexer.TYPE.NUMBER) {
            this.errorsList.push("ATTR_VALUE expected, got " + value.type.toString());
            return null;
        }

        return {
            type: Parser.TYPE.ASSIGN,
            token: assign,
            op1: {
                type: Parser.TYPE.ATTR_NAME,
                token: attr
            },
            op2: {
                type: Parser.TYPE.ATTR_VALUE,
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
            type: Parser.TYPE.PROGRAM,
            token: null,
            op1: this.condition(),
            op2: this.consequence()
        };

        return program;
    }
}

Parser.TYPE = {
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

module.exports = Parser;