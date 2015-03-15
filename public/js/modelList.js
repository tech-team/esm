
//app entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'bootstrap-table', 'api/API', 'client/ModelList'],
        function($, jqUI, bt, API, ModelList) {
            $(function() {
                var api = new API();
                var modelList = new ModelList(api);
            });
        }
    );
});