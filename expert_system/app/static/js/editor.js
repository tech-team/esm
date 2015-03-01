
//app entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'bootstrap-table', 'editor/Editor', 'api/API'],
        function(_1, _2, _3, Editor, Client) {
            $(function() {
                var client = new Client();
                var editor = new Editor(client);
            });
        }
    );
});