"use strict";
var _ = require('lodash');

var StringStream = require("../../routes/rules_compiler/StringStream");
var Lexer = require("../../routes/rules_compiler/Lexer");

class LexerTest {
    static testSimpleMath() {
        var sourceCode = "if a==b then c=d";
        var tokens = LexerTest._test(sourceCode).tokens;

        console.assert(tokens.length == 8);
    }

    static testSimpleEnglish() {
        var sourceCode = "if a==b then c=d";
        var tokens = LexerTest._test(sourceCode).tokens;

        console.assert(tokens.length == 8);
    }

    static testSimpleRussian() {
        var sourceCode = "ежели Вася является алкоголиком то беда будет точно";
        var tokens = LexerTest._test(sourceCode).tokens;

        console.assert(tokens.length == 8);
    }

    static testAnd() {
        var sourceCode = "ежели Вася является алкоголиком и Маша не_является акоголиком то беда будет точно";
        var tokens = LexerTest._test(sourceCode).tokens;

        console.assert(tokens.length == 12);
    }

    static testMultipleAnd() {
        var sourceCode = "if a==b and c==d and e==f then m=n";
        var result = LexerTest._test(sourceCode);
        var lexer = result.lexer;
        var tokens = result.tokens;

        var ands = _.filter(tokens, _.matches({type: lexer.TYPE.AND}));
        console.assert(ands.length == 2);
    }

    static testMultipleAndAfterThen() {
        var sourceCode = "if a==b then m=n and e=f and l=20";
        var result = LexerTest._test(sourceCode);
        var lexer = result.lexer;
        var tokens = result.tokens;

        var ands = _.filter(tokens, _.matches({type: lexer.TYPE.AND}));
        console.assert(ands.length == 2);
    }

    static testNumbers() {
        var sourceCode = "if a==10 and c==20 then m=40";
        var result = LexerTest._test(sourceCode);
        var lexer = result.lexer;
        var tokens = result.tokens;

        var numbers = _.filter(tokens, _.matches({type: lexer.TYPE.NUMBER}));
        console.assert(numbers.length == 3);
    }

    static testNegativeNumbers() {
        var sourceCode = "if a==-12 then m=40";
        var result = LexerTest._test(sourceCode);
        var lexer = result.lexer;
        var tokens = result.tokens;

        var found = _.find(tokens, _.matches({
            type: lexer.TYPE.NUMBER,
            value: -12
        }));
        console.assert(found);
    }

    //TODO: change in future
    static testDecimals() {
        var sourceCode = "if a==1.2 then m=40";
        var result = LexerTest._test(sourceCode);
        var lexer = result.lexer;
        var tokens = result.tokens;

        var found = _.find(tokens, _.matches({
            type: lexer.TYPE.NUMBER,
            value: 1
        }));
        console.assert(found);
    }

    //TODO: change in future
    static testMulipleDots() {
        var sourceCode = "if a==1.2.3.4..5 then m=40";
        var result = LexerTest._test(sourceCode);
        var lexer = result.lexer;
        var tokens = result.tokens;

        var found = _.find(tokens, _.matches({
            type: lexer.TYPE.NUMBER,
            value: 1
        }));
        console.assert(found);
    }

    static testOperations() {
        var sourceCode = "if a>10 and c<20 then m=50";
        var result = LexerTest._test(sourceCode);
        var lexer = result.lexer;
        var tokens = result.tokens;

        console.assert(_.find(tokens, {type: lexer.TYPE.MORE}));
        console.assert(_.find(tokens, {type: lexer.TYPE.LESS}));
    }

    static _test(sourceCode) {
        var lexer = new Lexer(
            new StringStream(sourceCode),
            console.log.bind(console));

        var tokens = [];

        var token = null;
        while ((token = lexer.getNextToken()).type != lexer.TYPE.EOF ) {
            tokens.push(token);
        }

        //console.log();
        //console.log("--------------------------------");
        console.log(tokens);

        return {
            tokens: tokens,
            lexer: lexer
        };
    }
}

_.forOwn(LexerTest, function (method) {
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