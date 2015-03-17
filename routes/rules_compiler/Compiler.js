"use strict";
var _ = require('lodash');

var Lexer = require('./Lexer');
var Parser = require('./Parser');
var StringStream = require('./StringStream');


class Compiler {
    /**
     * @param sourceCode {String}
     * @param errorsList {Array}
     * @returns {node|null} AST
     */
    static parse(sourceCode, errorsList) {
        var lexer = new Lexer(
            new StringStream(sourceCode),
            errorsList
        );

        var parser = new Parser(
            lexer,
            errorsList
        );

        return parser.parse();
    }

    /**
     * Compiles ast to JS Function
     * @param ast {Object} result from parse()
     * @param errorsList {Array}
     * @returns {Function|null}
     */
    static compileAST(ast, errorsList) {
        var functionBody = Compiler.compileASTSerialized(ast, errorsList);

        return Compiler.createFunction(functionBody, errorsList);
    }

    /**
     * Creates new Function
     * @param functionBody {String} javascript code
     * @param errorsList {Array}
     * @returns {Function|null}
     */
    static createFunction(functionBody, errorsList) {
        try {
            var js = new Function('params', 'attributes', functionBody);
            return js;
        } catch (e) {
            errorsList.push("[Compiler] " + e.message);
            return null;
        }
    }

    /**
     * Compiles AST to string
     * @param ast {Object} result from parse()
     * @param errorsList {Array}
     * @returns {String} body of function
     */
    static compileASTSerialized(ast, errorsList) {
        var params = ast.op1.op1.params;
        var attributes = ast.op2.op1.attributes;

        if (_.isEmpty(params)) {
            errorsList.push("[Compiler] Invalid AST: params: " + JSON.stringify(params));
            return null;
        }

        if (_.isEmpty(attributes)) {
            errorsList.push("[Compiler] Invalid AST: attributes: " + JSON.stringify(attributes));
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
                default:
                    errorsList.push("Unsupported operation: " + op.toString());
                    op = "=";
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
     * @param errorsList {Array}
     * @returns {String} body of function
     */
    static compileStringSerialized(sourceCode, errorsList) {
        var ast = Compiler.parse(sourceCode, errorsList);
        return Compiler.compileASTSerialized(ast, errorsList);
    }

    /**
     * Parse + compileAST
     * @param sourceCode {String}
     * @param errorsList {Array}
     * @returns {Function}
     */
    static compileString(sourceCode, errorsList) {
        var ast = Compiler.parse(sourceCode, errorsList);
        return Compiler.compileAST(ast, errorsList);
    }

    /**
     * @param ast {JSON} AST
     * @param paramsSet {Array} set of parameters
     * @param attrsSet {Array} set of attributes
     * @param errorsList {Array}
     * @returns {Boolean}
     */
    static validateAST(ast, paramsSet, attrsSet, errorsList) {
        var astParams = ast.op1.op1.params;
        var astAttributes = ast.op2.op1.attributes;

        var valid = true;

        // STEP 1: validate params
        // astParams should be subset of paramsSet
        _.each(astParams, function (astParam) {
            var astParamName = astParam.op1.token.value;

            var setParam = _.find(paramsSet, {
                param: astParamName
            });

            if (!setParam) {
                errorsList.push("Unknown param: " + astParamName);
                valid = false;
                return true;  // continue
            }

            // astParamType should match setParamType
            var astParamType = astParam.op2.token.type == Lexer.TYPE.IDENTIFIER
                ? 'choice' : 'number';

            var setParamType = setParam.type;
            var astParamValue = astParam.op2.token.value;

            if (astParamType != setParamType) {
                errorsList.push(
                    "Param value should match it's type:"
                    + " expected type: " + setParamType
                    + ", value: " + astParamValue);
                valid = false;
                return true;  // continue
            }

            if (setParamType == 'choice') {
                // astParamValue should be in setParamValues
                var setParamValue = _.contains(setParam.values, astParamValue);
                if (!setParamValue) {
                    errorsList.push(
                        "Unknown value: " + astParamValue
                        + ", for param: " + astParamName);
                    valid = false;
                }
            }
        });

        // STEP 2: validate attrs
        //TODO

        return valid;
    }

    /**
     * @param sourceCode {String}
     * @param paramsSet {Array}
     * @param attrsSet {Array}
     * @param errorsList {Array}
     * @returns {Boolean}
     */
    static validateString(sourceCode, paramsSet, attrsSet, errorsList) {
        var ast = Compiler.parse(sourceCode, errorsList);
        return Compiler.validateAST(ast, paramsSet, attrsSet, errorsList);
    }
}

module.exports = Compiler;