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
                    alert("TODO: redirect to /editor and create empty model");
                });
            },

            renderModelList: function (models) {
                this.$modelsTable.bootstrapTable({
                    striped: true,
                    columns: [
                        {
                            title: "Name",
                            formatter: this._modelLinkFormatter.bind(this),
                            events: {
                                'click .edit': function () {
                                    //TODO
                                    alert("click .edit");
                                }
                            }
                        },
                        {
                            title: "",
                            width: 50,
                            formatter: this._operateFormatter.bind(this)
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
