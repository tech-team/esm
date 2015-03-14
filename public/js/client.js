
//app entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'api/API', 'client/Client'],
        function($, jqUI, API, Client) {
            $(function() {
                var api = new API();
                var client = new Client(api);
            });
        }
    );
});