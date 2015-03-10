
//app entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'api/API', 'client/Poll'],
        function($, jqUI, API, Poll) {
            $(function() {
                var api = new API();
                var poll = new Poll(api);
            });
        }
    );
});