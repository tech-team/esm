"use strict";
var _ = require('lodash');

var Lexer = require('./Lexer');
var Parser = require('./Parser');
var StringStream = require('./StringStream');


class Compiler {
    /**
     * @param sourceCode {String}
     * @param onError {Function} callback
     * @returns {node|null} AST
     */
    static parse(sourceCode, onError) {
        var lexer = new Lexer(
            new StringStream(sourceCode),
            function (e) {
                onError("[Lexer] " + e);
            }
        );

        var parser = new Parser(
            lexer,
            function (e) {
                onError("[Parser] " + e);
            }
        );

        return parser.parse();
    }

    /**
     * Compiles ast to JS Function
     * @param ast {Object} result from parse()
     * @param onError {Function} callback
     * @returns {Function|null}
     */
    static compileAST(ast, onError) {
        var functionBody = Compiler.compileASTSerialized(ast, onError);

        return Compiler.createFunction(functionBody, onError);
    }

    /**
     * Creates new Function
     * @param functionBody {String} javascript code
     * @param onError {Function} callback
     * @returns {Function|null}
     */
    static createFunction(functionBody, onError) {
        try {
            var js = new Function('params', 'attributes', functionBody);
            return js;
        } catch (e) {
            onError("[Compiler] " + e.message);
            return null;
        }
    }

    /**
     * Compiles AST to string
     * @param ast {Object} result from parse()
     * @param onError {Function} callback
     * @returns {String} body of function
     */
    static compileASTSerialized(ast, onError) {
        var params = ast.op1.op1.params;
        var attributes = ast.op2.op1.attributes;

        if (_.isEmpty(params)) {
            onError("[Compiler] Invalid AST: params: " + JSON.stringify(params));
            return null;
        }

        if (_.isEmpty(attributes)) {
            onError("[Compiler] Invalid AST: attributes: " + JSON.stringify(attributes));
            return null;
        }

        var code = "if (";

        code = _.reduce(params, function (code, param) {
            var name = param.op1.token.value;
            var op = param.token.type;

            switch (op) {
                case Lexer.TYPE.EQUAL:
                    op = "==";
                    break;
                case Lexer.TYPE.LESS:
                    op = "<";
                    break;
                case Lexer.TYPE.LESS_OR_EQUAL:
                    op = "<=";
                    break;
                case Lexer.TYPE.MORE:
                    op = ">";
                    break;
                case Lexer.TYPE.MORE_OR_EQUAL:
                    op = ">=";
                    break;
                case Lexer.TYPE.NOT_EQUAL:
                    op = "!=";
                    break;
            }

            var value = param.op2.token.value;

            if (!_.isNumber(value))
                value = "'" + value + "'";

            return code + "params['" + name + "'] " + op +  " " + value + " && ";
        }, code);

        code += "true) {\n";

        code = _.reduce(attributes, function (code, attr) {
            var name = attr.op1.token.value;
            var value = attr.op2.token.value;
            if (!_.isNumber(value))
                value = "'" + value + "'";

            return code + "attributes['" + name + "'] = " + value + ";\n";
        }, code);

        code += "\n}";

        return code;
    }

    /**
     * Compiles AST to string
     * @param sourceCode {String}
     * @param onError {Function} callback
     * @returns {String} body of function
     */
    static compileStringSerialized(sourceCode, onError) {
        var ast = Compiler.parse(sourceCode, onError);
        return Compiler.compileASTSerialized(ast, onError);
    }

    /**
     * Parse + compileAST
     * @param sourceCode {String}
     * @param onError {Function} callback
     * @returns {Function}
     */
    static compileString(sourceCode, onError) {
        var ast = Compiler.parse(sourceCode, onError);
        return Compiler.compileAST(ast, onError);
    }

    /**
     * @param ast {JSON} AST
     * @param paramsSet {Array} set of parameters
     * @param attrsSet {Array} set of attributes
     * @param onError {Function}
     * @returns {Boolean}
     */
    static validateAST(ast, paramsSet, attrsSet, onError) {
        var params = ast.op1.op1.params;
        var attributes = ast.op2.op1.attributes;

        //TODO

        _.each(params, function (param) {

        });

        return true;
    }
}

module.exports = Compiler;