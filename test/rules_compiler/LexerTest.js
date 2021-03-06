"use strict";
var _ = require('lodash');

var StringStream = require("../../routes/rules_compiler/StringStream");
var Lexer = require("../../routes/rules_compiler/Lexer");
var TestRunner = require('../TestRunner');
var MagicArray = require('../../routes/rules_compiler/MagicArray');


class LexerTest {
    testSimpleMath() {
        var sourceCode = "if a==b then c=d";
        var tokens = LexerTest._test(sourceCode);

        console.assert(tokens.length == 8);
    }

    testSimpleEnglish() {
        var sourceCode = "if a==b then c=d";
        var tokens = LexerTest._test(sourceCode);

        console.assert(tokens.length == 8);
    }

    testSimpleRussian() {
        var sourceCode = "ежели Вася является алкоголиком то беда будет точно";
        var tokens = LexerTest._test(sourceCode);

        console.assert(tokens.length == 8);
    }

    testAnd() {
        var sourceCode = "if p1>10 and p2<10 then a3=yes";
        var tokens = LexerTest._test(sourceCode);

        console.assert(tokens.length == 12);
    }

    testMultipleAnd() {
        var sourceCode = "if a==b and c==d and e==f then m=n";
        var tokens = LexerTest._test(sourceCode);

        var ands = _.filter(tokens, _.matches({type: Lexer.TYPE.AND}));
        console.assert(ands.length == 2);
    }

    testMultipleAndAfterThen() {
        var sourceCode = "if a==b then m=n and e=f and l=20";
        var tokens = LexerTest._test(sourceCode);

        var ands = _.filter(tokens, _.matches({type: Lexer.TYPE.AND}));
        console.assert(ands.length == 2);
    }

    testNumbers() {
        var sourceCode = "if a==10 and c==20 then m=40";
        var tokens = LexerTest._test(sourceCode);

        var numbers = _.filter(tokens, _.matches({type: Lexer.TYPE.NUMBER}));
        console.assert(numbers.length == 3);
    }

    testNegativeNumbers() {
        var sourceCode = "if a==-12 then m=40";
        var tokens = LexerTest._test(sourceCode);

        var found = _.find(tokens, _.matches({
            type: Lexer.TYPE.NUMBER,
            value: -12
        }));
        console.assert(found);
    }

    //TODO: change in future
    testDecimals() {
        var sourceCode = "if a==1.2 then m=40";
        var tokens = LexerTest._test(sourceCode);

        var found = _.find(tokens, _.matches({
            type: Lexer.TYPE.NUMBER,
            value: 1.2
        }));
        console.assert(found);
    }

    //TODO: change in future
    testMulipleDots() {
        var sourceCode = "if a==1.2.3.4..5 then m=40";
        var tokens = LexerTest._test(sourceCode);

        var found = _.find(tokens, _.matches({
            type: Lexer.TYPE.NUMBER,
            value: 1.2
        }));
        console.assert(found);
    }

    testOperations() {
        var sourceCode = "if a>10 and c<20 then m=50";
        var tokens = LexerTest._test(sourceCode);

        console.assert(_.find(tokens, {type: Lexer.TYPE.MORE}));
        console.assert(_.find(tokens, {type: Lexer.TYPE.LESS}));
    }

    testAlphanumeric() {
        var sourceCode = "if  my_param_1==5 then myattr1=2";
        var tokens = LexerTest._test(sourceCode);

        console.assert(_.find(tokens, {value: "my_param_1"}));
        console.assert(_.find(tokens, {value: "myattr1"}));
    }

    static _test(sourceCode) {
        var errorsList = new MagicArray(console.error.bind(console));

        var lexer = new Lexer(
            new StringStream(sourceCode),
            errorsList);

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