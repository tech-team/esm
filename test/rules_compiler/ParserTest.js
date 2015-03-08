"use strict";
var _ = require('lodash');
var util = require('util');

var StringStream = require("../../routes/rules_compiler/StringStream");
var Lexer = require("../../routes/rules_compiler/Lexer");
var Parser = require("../../routes/rules_compiler/Parser");
var TestRunner = require('../TestRunner');

class ParserTest {
    static testSimple() {
        var sourceCode = "if a==b then c=d";
        var tokens = ParserTest._test(sourceCode);
    }

    static testMuitipleAnd() {
        var sourceCode = "if a==b and e>20 and a==3 then c=d";
        var tokens = ParserTest._test(sourceCode);
    }

    static _test(sourceCode) {
        var lexer = new Lexer(
            new StringStream(sourceCode),
            console.error.bind(console));

        var parser = new Parser(lexer, console.error.bind(console));

        var rootNode = parser.parse();

        console.log();
        console.log(util.inspect(rootNode, true, 10));

        return rootNode;
    }
}

TestRunner.run(ParserTest);