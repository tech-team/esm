var StringStream = require("../../routes/rules_compiler/StringStream");
var Lexer = require("../../routes/rules_compiler/Lexer");

var sourceCode = "если это=заработает то будет=круто";

var lexer = new Lexer(
    new StringStream(sourceCode),
    console.log.bind(console));

var tokens = [];

var token = null;
while ((token = lexer.getNextToken()) != null ) {
    tokens.push(token);
}

console.log(tokens);
console.assert(tokens.length == 8);