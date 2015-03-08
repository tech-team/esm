"use strict";
var _ = require('lodash');

var Compiler = require('../../routes/rules_compiler/Compiler');
var TestRunner = require('../TestRunner');

class CompilerTest {
    static test() {
        var sourceCode = "if a==b and e<10 then c=d";

        var js = Compiler.compileString(
            sourceCode,
            console.error.bind(console));

        var params = {
            a: 'b',
            e: 5
        };

        var attributes = {};

        js(params, attributes);

        console.assert(attributes.c == 'd');
    }
}

TestRunner.run(CompilerTest);