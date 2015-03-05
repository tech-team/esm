var Lexer = require('./Lexer');
var Parser = require('./Parser');
var StringStream = require('./StringStream');

/**
 * Lexer+Parser facade
 */
class Compiler {
    /**
     * @param sourceCode {String}
     * @param onError {Function} callback
     * @returns {node|null}
     */
    static compile(sourceCode, onError) {
        var lexer = new Lexer(
            new StringStream(sourceCode),
            function (e) {
                onError("[Lexer] " + e);
            }
        );

        var parser = new Parser(
            lexer,
            function (e) {
                onError("[Parser] " + e);
            }
        );

        return parser.parse();
    }
}

module.exports = Compiler;