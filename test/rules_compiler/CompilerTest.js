"use strict";
var _ = require('lodash');

var Compiler = require('../../routes/rules_compiler/Compiler');
var TestRunner = require('../TestRunner');
var MagicArray = require('../../routes/rules_compiler/MagicArray');

class CompilerTest {
    setUp() {
        this.errorsList = new MagicArray(console.error.bind(console));

        this.sourceCode = "if a==b and e<10 then c=d";
        this.ast = Compiler.parse(this.sourceCode, this.errorsList);
        this.js = Compiler.compileAST(this.ast, this.errorsList);
    }

    testAnd() {
        var sourceCode = "if p1>10 and p2<10 then a3=yes";
        var result = Compiler.compileStringSerialized(sourceCode, this.errorsList);

        console.log(result);

        console.assert(result.match(/&&/) != null);
    }

    testOk() {
        var params = {
            a: 'b',
            e: 5
        };

        var attributes = {};

        this.js(params, attributes);

        console.assert(attributes.c == 'd');
    }

    testNumFail() {
        var params = {
            a: 'b',
            e: 15
        };

        var attributes = {};

        this.js(params, attributes);

        console.assert(attributes.c != 'd');
    }

    testChoiceFail() {
        var params = {
            a: 'q',
            e: 5
        };

        var attributes = {};

        this.js(params, attributes);

        console.assert(attributes.c != 'd');
    }

    testNulls() {
        var params = {
            a: null,
            e: null
        };

        var attributes = {};

        this.js(params, attributes);

        console.assert(attributes.c != 'd');
    }

    testSerialized() {
        var code = Compiler.compileStringSerialized(this.sourceCode, this.errorsList);
        this.js = Compiler.createFunction(code, this.errorsList);

        var params = {
            a: 'b',
            e: 5
        };

        var attributes = {};

        this.js(params, attributes);

        console.assert(attributes.c == 'd');
    }

    testValidateOk() {
        var paramsSet = [{
            param: 'a',
            type: 'choice',
            values: ['a', 'b', 'e']
        }, {
            param: 'e',
            type: 'number',
            values: []
        }];

        var attrsSet = [{
            name: 'c',
            type: 'choice',
            values: ['d', 'e']
        }];

        var ast = this.ast;

        var valid = Compiler.validateAST(ast, paramsSet, attrsSet, this.errorsList);
        console.assert(valid);
    }


    testValidateFail() {
        var paramsSet = [{
            param: 'a',
            type: 'choice',
            values: ['this', 'is', 'wrong']
        }, {
            param: 'e',
            type: 'choice',  // this should be be number
            values: []
        }];

        var attrsSet = [{
            name: 'c',
            type: 'choice',
            values: ['d', 'e']
        }];

        var ast = this.ast;

        var valid = Compiler.validateAST(ast, paramsSet, attrsSet, this.errorsList);
        console.assert(!valid);
    }
}

TestRunner.run(CompilerTest);