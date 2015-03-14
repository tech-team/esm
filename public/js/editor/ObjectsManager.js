define(['jquery', 'lodash', 'util/Templater', 'api/Exceptions', 'editor/Model'],
    function($, _, Templater, Exceptions, Model) {
        var Editor = Class.create({
            initialize: function (api) {
                var self = this;

                this._model = new Model();
                this._loadTemplates();

                this.$objectsTable = $("#objects-table");

                var $saveButton = $(".save-model");
                $saveButton.click(function () {
                    alert("TODO");
                });

                // render header
                var attributes = _.map(this._model.getAttributes(), function (attr) {
                    return attr.name;
                });
                this.createHeader(attributes);

                // render objects
                var objects = this._model.getObjects();
                _.each(objects, function (object) {
                    this.addObjectRow(object);
                }, this);

                var $addObjectButton = $('#add-object');
                $addObjectButton.click(function () {
                    var object = self._model.createObject();
                    self.addObjectRow(object);
                });
            },

            createHeader: function (headers) {
                var header = this._templates.headerRow({
                    headers: headers
                });
                this.$objectsTable.find("thead").html(header);
            },

            addObjectRow: function (object) {
                var attributes = this._model.getAttributes();

                var cells = _.map(attributes, function (attr) {
                    var name = attr.name;
                    var value = object[name];
                    var type = attr.type;
                    var entries = attr.values;

                    return this._partials[type]({
                        field: name,
                        value: value,
                        entries: this._prepareSelect(entries, value)
                    });
                }, this);

                var row = this._templates.objectRow({
                    columns: cells
                });

                var $row = $(row);
                $row.appendTo(this.$objectsTable);
            },

            _prepareSelect: function (entries, selectedValue) {
                return _.map(_.cloneDeep(entries), function (entry) {
                    if (entry.value == selectedValue)
                        entry.selected = "selected";

                    return entry;
                });
            },

            _loadTemplates: function () {
                this._partials = {
                    input: Templater.load('#input-template'),
                    number: Templater.load('#number-template'),
                    choice: Templater.load('#select-template'),
                    combobox: Templater.load('#combobox-template'),
                    operate: Templater.load('#operate-template'),
                };

                Templater.registerPartials(this._partials);

                this._templates =  {
                    headerRow: Templater.load('#header-row-template'),
                    objectRow: Templater.load('#object-row-template')
                };
            }
        });
    
        return Editor;
    }
);