define(['jquery', 'lodash', 'util/Url', 'util/Templater'],
    function($, _, Url, Templater) {
        var Client = Class.create({
            initialize: function (api) {
                var self = this;

                this.api  = api;

            }
        });

        return Client;
    }
);
