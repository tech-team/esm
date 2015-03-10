
//app entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'editor/Editor', 'api/API'],
        function($, jqUI, Editor, Client) {
            $(function() {
                var client = new Client();
                var editor = new Editor(client);
            });
        }
    );
});