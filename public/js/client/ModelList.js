define(['jquery', 'lodash', 'util/Url', 'util/Templater'],
    function($, _, Url, Templater) {
        var ModelList = Class.create({
            initialize: function (api) {
                var self = this;
                this.api = api;

                this.$modelsTable = $("#models-table");
                this._loadTemplates();

                this.api.getModelList({
                    onComplete: function (list) {
                        self.renderModelList(list.models);
                    },
                    onError: function (e) {
                        alert(JSON.stringify(e));
                        console.error(e);
                    }
                });

                var $createModelButton = $('#create-model');
                $createModelButton.click(function () {
                    window.location.href = "/editor";
                });
            },

            renderModelList: function (models) {
                this.$modelsTable.bootstrapTable({
                    striped: true,
                    columns: [
                        {
                            title: "Name",
                            formatter: this._modelLinkFormatter.bind(this)
                        },
                        {
                            title: "",
                            width: 50,
                            formatter: this._operateFormatter.bind(this),
                            events: {
                                'click .edit': this._openEditor.bind(this)
                            }
                        }
                    ],
                    data: models
                });
                this.$modelsTable.bootstrapTable('hideLoading');
            },

            _modelLinkFormatter: function (entries, value, row, index) {
                return this._partials.link({
                    modelId: value._id,
                    modelName: value.name
                })
            },

            _operateFormatter: function (entries, value, row, index) {
                return this._partials.operate({
                    modelId: value._id
                });
            },

            _openEditor: function (e, value, row, index) {
                window.location.href = "/editor?modelId=" + row._id;
            },

            _loadTemplates: function () {
                this._partials = {
                    link: Templater.load('#link-template'),
                    operate: Templater.load('#operate-template')
                };

                Templater.registerPartials(this._partials);
            },
        });

        return ModelList;
    }
);
