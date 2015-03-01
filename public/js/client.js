
//app entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'api/API'],
        function(_1, _2, Client) {
            $(function() {
                var client = new Client();

            });
        }
    );
});