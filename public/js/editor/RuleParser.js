
define(['lodash'],
    function (_) {
        var RuleParser = Class.create({
            initialize: function () {
                this.Token = {
                    IF: 0,
                    PARAMETER: 1,
                    OPERATION: 2,
                    ATTRIBUTE: 3,
                    THEN: 4,
                    AND: 5
                };
            },

            compile: function (ruleStr) {
                var tokens = this._tokenize(ruleStr);
                var result = this._parse(tokens);

                return result;
            },

            _tokenize: function (ruleStr) {
                var words = ruleStr.split(/\s+/g);
                var tokens = [];

                _.each(words, function (token) {
                    if (token.match(/если/i)) {
                        tokens.push({
                            type: Token.IF,
                            value: token
                        });
                    } else if (token.match(/то/i) {
                        tokens.push({
                            type: Token.THEN,
                            value: token
                        });
                    } else if (token.match()) {

                    }
                });
            },

            _parse: function (tokens) {
                return tokens;
            }
        });

        return RuleParser;
    }
);