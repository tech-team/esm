
//app entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'api/API', 'util/Url', 'util/Templater'],
        function(_1, _2, API, Url, Templater) {
            $(function() {
                var api = new API();

                var templates = {
                    choice: Templater.load('#choice-template'),
                    number: Templater.load('#number-template')
                };

                var modelId = Url.getParams().modelId;

                api.init(modelId, {
                    onComplete: function (question) {
                        renderQuestion(question);
                    },
                    onError: function (e) {
                        alert(JSON.stringify(e));
                        console.error(e);
                    }
                });

                function renderQuestion (question) {
                    console.log(question);
                }
            });
        }
    );
});