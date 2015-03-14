
//app entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'editor/ObjectsManager', 'api/API'],
        function($, jqUI, ObjectsManager, Client) {
            $(function() {
                var client = new Client();
                var objectsManager = new ObjectsManager(client);
            });
        }
    );
});