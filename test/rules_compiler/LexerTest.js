"use strict";
var _ = require('lodash');

var StringStream = require("../../routes/rules_compiler/StringStream");
var Lexer = require("../../routes/rules_compiler/Lexer");
var TestRunner = require('../TestRunner');

class LexerTest {
    static testSimpleMath() {
        var sourceCode = "if a==b then c=d";
        var tokens = LexerTest._test(sourceCode);

        console.assert(tokens.length == 8);
    }

    static testSimpleEnglish() {
        var sourceCode = "if a==b then c=d";
        var tokens = LexerTest._test(sourceCode);

        console.assert(tokens.length == 8);
    }

    static testSimpleRussian() {
        var sourceCode = "ежели Вася является алкоголиком то беда будет точно";
        var tokens = LexerTest._test(sourceCode);

        console.assert(tokens.length == 8);
    }

    static testAnd() {
        var sourceCode = "ежели Вася является алкоголиком и Маша не_является акоголиком то беда будет точно";
        var tokens = LexerTest._test(sourceCode);

        console.assert(tokens.length == 12);
    }

    static testMultipleAnd() {
        var sourceCode = "if a==b and c==d and e==f then m=n";
        var tokens = LexerTest._test(sourceCode);

        var ands = _.filter(tokens, _.matches({type: Lexer.TYPE.AND}));
        console.assert(ands.length == 2);
    }

    static testMultipleAndAfterThen() {
        var sourceCode = "if a==b then m=n and e=f and l=20";
        var tokens = LexerTest._test(sourceCode);

        var ands = _.filter(tokens, _.matches({type: Lexer.TYPE.AND}));
        console.assert(ands.length == 2);
    }

    static testNumbers() {
        var sourceCode = "if a==10 and c==20 then m=40";
        var tokens = LexerTest._test(sourceCode);

        var numbers = _.filter(tokens, _.matches({type: Lexer.TYPE.NUMBER}));
        console.assert(numbers.length == 3);
    }

    static testNegativeNumbers() {
        var sourceCode = "if a==-12 then m=40";
        var tokens = LexerTest._test(sourceCode);

        var found = _.find(tokens, _.matches({
            type: Lexer.TYPE.NUMBER,
            value: -12
        }));
        console.assert(found);
    }

    //TODO: change in future
    static testDecimals() {
        var sourceCode = "if a==1.2 then m=40";
        var tokens = LexerTest._test(sourceCode);

        var found = _.find(tokens, _.matches({
            type: Lexer.TYPE.NUMBER,
            value: 1
        }));
        console.assert(found);
    }

    //TODO: change in future
    static testMulipleDots() {
        var sourceCode = "if a==1.2.3.4..5 then m=40";
        var tokens = LexerTest._test(sourceCode);

        var found = _.find(tokens, _.matches({
            type: Lexer.TYPE.NUMBER,
            value: 1
        }));
        console.assert(found);
    }

    static testOperations() {
        var sourceCode = "if a>10 and c<20 then m=50";
        var tokens = LexerTest._test(sourceCode);

        console.assert(_.find(tokens, {type: Lexer.TYPE.MORE}));
        console.assert(_.find(tokens, {type: Lexer.TYPE.LESS}));
    }

    static _test(sourceCode) {
        var lexer = new Lexer(
            new StringStream(sourceCode),
            console.log.bind(console));

        var tokens = [];

        var token = null;
        while ((token = lexer.getNextToken()).type != Lexer.TYPE.EOF ) {
            tokens.push(token);
        }

        //console.log();
        //console.log("--------------------------------");
        console.log(tokens);

        return tokens;
    }
}

TestRunner.run(LexerTest);