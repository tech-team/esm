"use strict";
var _ = require('lodash');
var util = require('util');

var StringStream = require("../../routes/rules_compiler/StringStream");
var Lexer = require("../../routes/rules_compiler/Lexer");
var Parser = require("../../routes/rules_compiler/Parser");
var TestRunner = require('../TestRunner');
var MagicArray = require('../../routes/rules_compiler/MagicArray');

class ParserTest {
    testSimpleOk() {
        var sourceCode = "if a==b then c=d";
        var result = this._test(sourceCode);

        console.assert(result.errorsList.length == 0);
    }

    testSimpleFail() {
        var sourceCode = "if a=b then c=d";
        var result = this._test(sourceCode);

        console.assert(result.errorsList.length != 0);
    }

    testAttrFail() {
        var sourceCode = "if a==b then c=d";
        var result = this._test(sourceCode);

        console.assert(result.errorsList.length != 0);
    }

    testTime() {
        var sourceCode = "if a==b and e>20 and a==3 then c=d";

        console.time("testMultipleAnd");

        for (let i = 0; i < 100; ++i) {
            var result = this._test(sourceCode);
        }

        console.timeEnd("testMultipleAnd");
    }

    _test(sourceCode) {
        var errorsList = [];

        var lexer = new Lexer(
            new StringStream(sourceCode),
            errorsList);

        var parser = new Parser(lexer, errorsList);

        var rootNode = parser.parse();

        if (!errorsList.length) {
            //console.log();
            //console.log(rootNode);
        } else {
            console.error();
            console.error(errorsList);
        }

        return {
            ast: rootNode,
            errorsList: errorsList
        };
    }
}

TestRunner.run(ParserTest);