define(['jquery', 'lodash', 'util/Templater', 'api/Exceptions', 'editor/Model', 'util/Alert'],
    function($, _, Templater, Exceptions, Model, Alert) {
        var ObjectsManager = Class.create({
            initialize: function (api, modelId) {
                var self = this;

                this.api = api;

                this._model = new Model();
                this._loadTemplates();

                this.$objectsContainer = $("#objects-container");

                if (!modelId) {
                    this._initialize();
                } else {
                    this.api.loadModel(modelId, {
                        onComplete: function (msg) {
                            self._initialize(msg.model)
                        },
                        onError: function (msg) {
                            Alert.showError(msg);
                        }
                    })
                }

                var $saveButton = $(".save-model");
                $saveButton.click(this._onSaveModelClick.bind(this));
            },

            _initialize: function (modelData) {
                var self = this;
                this._model = new Model(modelData);

                // render objects
                var objects = this._model.getObjects();
                _.each(objects, function (object) {
                    self.addObject(objects, object);
                }, this);

                var $addObjectButton = $('#add-object');
                $addObjectButton.click(function () {
                    var object = self._model.createObject();
                    self.addObject(objects, object);
                });
            },

            addObject: function (objects, object) {
                var attrs = this._model.getAttributes();

                var renderedAttrs = _.map(attrs, function (attr) {
                    var name = attr.name;
                    var value = object.attributes[name];
                    var type = attr.type;

                    var entries = _.map(attr.values, function (value) {
                        return {
                            value: value,
                            text: value
                        }
                    });

                    var control = this._partials[type]({
                        field: name,
                        value: value,
                        entries: this._prepareSelect(entries, value)
                    });

                    return {
                        attrName: name.replace('_', ' '),
                        control: control
                    };
                }, this);

                var card = this._templates.card({
                    name: object.name,
                    attrs: renderedAttrs
                });

                var $card = $(card);

                // handle input events and .remove
                // name
                var $name = $card.find(".name");
                $name.on('input', function () {
                    var value = $name.val();

                    object.name = value;
                });

                // attrs
                var $fields = $card.find('input, select');
                var handler = function () {
                    var $field = $(this);
                    var key = $field.data('field');
                    var value = $field.val();

                    // ignore data-field-less fields
                    if (!key)
                        return;

                    if (key == "values")
                        value = value.split(',');

                    console.log("Field changed: ", key, value);
                    if ($field.attr('type') == 'number')
                        value = parseFloat(value);

                    object.attributes[key] = value;
                };

                $fields.on('input', handler);

                var $removeButton = $card.find('.remove');
                $removeButton.click(function (e) {
                    e.preventDefault();
                    objects.remove(object);
                    $card.hide($card.remove.bind($card));
                });

                $card.appendTo(this.$objectsContainer);

                $fields.each(handler);
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
                    number: Templater.load('#number-template'),
                    choice: Templater.load('#select-template'),
                    operate: Templater.load('#operate-template'),
                };

                Templater.registerPartials(this._partials);

                this._templates =  {
                    card: Templater.load('#card-template')
                };
            },

            _onSaveModelClick: function () {
                var self = this;
                console.log("Model: ", this._model.getData());

                this.api.saveObjects({
                    modelId: this._model.getId(),
                    objects: this._model.getObjects()
                }, {
                    onComplete: function (msg) {
                        Alert.showSuccess("Model saved successfully",
                            history.back.bind(history));
                    },
                    onError: function (msg) {
                        Alert.showError(msg);
                    }
                });
            }
        });
    
        return ObjectsManager;
    }
);