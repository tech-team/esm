"use strict";
var _ = require('lodash');

var Compiler = require('../../routes/rules_compiler/Compiler');
var TestRunner = require('../TestRunner');

class CompilerTest {
    static test() {
        var sourceCode = "if a==b then c=d";

        var rootNode = Compiler.compile(
            sourceCode,
            console.error.bind(console));

        //TODO: Parser is not fully implemented
        console.assert(rootNode == null);
    }
}

TestRunner.run(CompilerTest);