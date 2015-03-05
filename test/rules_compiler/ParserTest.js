"use strict";
var _ = require('lodash');

var StringStream = require("../../routes/rules_compiler/StringStream");
var Lexer = require("../../routes/rules_compiler/Lexer");
var Parser = require("../../routes/rules_compiler/Parser");

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

_.forOwn(ParserTest, function (method) {
    if (_.isFunction(method) && /^test/.test(method.name)) {
        console.info("-------[TEST] " + method.name + " started");
        try {
            method();
        } catch(e) {
            console.error("-------[TEST] " + method.name + " failed");
            console.error(e.stack);
            console.info();

            return false;
        }
        console.info("-------[TEST] " + method.name + " finished");
        console.info();
    }
});