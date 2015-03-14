define(['jquery', 'lodash', 'util/Url', 'util/Templater'],
    function($, _, Url, Templater) {
        var Client = Class.create({
            initialize: function (api) {
                var self = this;
                this.api = api;

                this.$container = $("#model-list");
                this._templates = {
                    list: Templater.load("#list-template")
                };

                this.api.getModelList({
                    onComplete: function (list) {
                        self.renderModelList(list.models);
                    },
                    onError: function (e) {
                        alert(JSON.stringify(e));
                        console.error(e);
                    }
                });
            },

            renderModelList: function (models) {
                var list = this._templates.list({
                    models: models
                });
                var $list = $(list);

                $list.appendTo(this.$container);
            }
        });

        return Client;
    }
);
