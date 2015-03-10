
//app entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'api/API', 'url/Template'],
        function($, jqUI, API, Url) {
            $(function() {
                var api = new API();

                api.getModelList({
                    onComplete: function (list) {
                        renderModelList(list);
                    },
                    onError: function (e) {
                        alert(JSON.stringify(e));
                        console.error(e);
                    }
                });

                function renderModelList (list) {
                    console.log(list);
                }
            });
        }
    );
});