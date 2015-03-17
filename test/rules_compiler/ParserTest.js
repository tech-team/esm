"use strict";
var _ = require('lodash');
var util = require('util');

var StringStream = require("../../routes/rules_compiler/StringStream");
var Lexer = require("../../routes/rules_compiler/Lexer");
var Parser = require("../../routes/rules_compiler/Parser");
var TestRunner = require('../TestRunner');
var MagicArray = require('../../routes/rules_compiler/MagicArray');

class ParserTest {
    testSimple() {
        var sourceCode = "if a==b then c=d";
        var tokens = this._test(sourceCode);
    }

    testTime() {
        var sourceCode = "if a==b and e>20 and a==3 then c=d";

        console.time("testMultipleAnd");

        for (let i = 0; i < 100; ++i) {
            var tokens = this._test(sourceCode);
        }

        console.timeEnd("testMultipleAnd");
    }

    _test(sourceCode) {
        var errorsList = new MagicArray(console.error.bind(console));

        var lexer = new Lexer(
            new StringStream(sourceCode),
            errorsList);

        var parser = new Parser(lexer, errorsList);

        var rootNode = parser.parse();

        console.log();
        console.log(util.inspect(rootNode, true, 10));

        return rootNode;
    }
}

TestRunner.run(ParserTest);