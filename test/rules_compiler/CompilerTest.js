"use strict";
var _ = require('lodash');

var Compiler = require('../../routes/rules_compiler/Compiler');
var TestRunner = require('../TestRunner');

class CompilerTest {
    setUp() {
        this.sourceCode = "if a==b and e<10 then c=d";
        this.js = Compiler.compileString(this.sourceCode, console.error.bind(console));
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

    testSerialzed() {
        var code = Compiler.compileStringSerialized(this.sourceCode, console.error.bind(console));
        this.js = Compiler.createFunction(code, console.error.bind(console));

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