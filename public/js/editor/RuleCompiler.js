
define(['lodash'],
    function (_) {
        var RuleCompiler = Class.create({
            Token: {
                IF: 0,
                IDENTIFIER: 1,
                OPERATION: 2,
                THEN: 3,
                AND: 4
            },

            initialize: function () {

            },

            compile: function (ruleStr) {
                var tokens = this._tokenize(ruleStr);
                var result = this._parse(tokens);

                return result;
            },

            _tokenize: function (ruleStr) {
                var tokens = [];

                for (var i = 0; i < ruleStr.length; ++i) {
                    var ch = ruleStr[i];

                    switch (ch) {
                        case
                    }
                }
            },

            _parse: function (tokens) {
                return tokens;
            }
        });

        return RuleCompiler;
    }
);