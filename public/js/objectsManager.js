
//app entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'editor/ObjectsManager', 'util/Url', 'api/API'],
        function($, jqUI, ObjectsManager, Url, API) {
            $(function() {
                var api = new API();

                var modelId = Url.getParams().modelId;
                var objectsManager = new ObjectsManager(api, modelId);
            });
        }
    );
});