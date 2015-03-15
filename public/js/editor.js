
//app entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'editor/Editor', 'api/API', 'util/Url'],
        function($, jqUI, Editor, API, Url) {
            $(function() {
                var api = new API();

                var modelId = Url.getParams().modelId;
                var editor = new Editor(api, modelId);
            });
        }
    );
});