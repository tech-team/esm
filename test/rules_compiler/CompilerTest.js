"use strict";
var _ = require('lodash');

var Compiler = require('../../routes/rules_compiler/Compiler');
var TestRunner = require('../TestRunner');
var MagicArray = require('../../routes/rules_compiler/MagicArray');

class CompilerTest {
    setUp() {
        this.errorsList = new MagicArray(console.error.bind(console));

        this.sourceCode = "if a==b and e<10 then c=d";
        this.js = Compiler.compileString(this.sourceCode, this.errorsList);
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
}

TestRunner.run(CompilerTest);