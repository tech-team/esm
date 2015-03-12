
//app entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'bootstrap-table', 'api/API', 'client/Report'],
        function($, jqUI, bt, API, Report) {
            $(function() {
                var api = new API();
                var report = new Report(api);
            });
        }
    );
});