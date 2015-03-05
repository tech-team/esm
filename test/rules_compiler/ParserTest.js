"use strict";
var _ = require('lodash');

var StringStream = require("../../routes/rules_compiler/StringStream");
var Lexer = require("../../routes/rules_compiler/Lexer");
var Parser = require("../../routes/rules_compiler/Parser");
var TestRunner = require('../TestRunner');

class ParserTest {
    static testSimpleMath() {
        var sourceCode = "if a==b then c=d";
        var tokens = ParserTest._test(sourceCode);
    }

    static _test(sourceCode) {
        var lexer = new Lexer(
            new StringStream(sourceCode),
            console.log.bind(console));

        var parser = new Parser(lexer, console.log.bind(console));

        var rootNode = parser.parse();

        console.log(rootNode);

        return rootNode;
    }
}

TestRunner.run(ParserTest);