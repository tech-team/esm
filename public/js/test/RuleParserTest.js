
define(['editor/RuleParser'],
    function(RuleParser) {
        var RuleParserTest = Class.create({
            test: function () {
                var rp = new RuleParser();
                var result = rp.compile("Если параметр1=значение1 и параметр2=значение2, то атрибут1=значение1");

                console.log(result);
            }
        });

        return RuleParserTest;
    }
);
