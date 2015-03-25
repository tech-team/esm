define(['jquery', 'lodash', 'util/Templater', 'api/Exceptions', 'editor/Model'],
    function($, _, Templater, Exceptions, Model) {
        var Editor = Class.create({
            initialize: function (api, modelId) {
                var self = this;
                this.api = api;

                this._loadTemplates();

                this._questionTypes = [
                    {
                        value: "choice",
                        text: "Выбор"
                    },
                    {
                        value: "number",
                        text: "Число"
                    }
                ];
                
                this._orderOps = [
                    {value: "==", text: "=="},
                    {value: ">", text: ">"},
                    {value: "<", text: "<"},
                    {value: ">=", text: ">="},
                    {value: "<=", text: "<="},
                    {value: "!=", text: "!="}
                ];

                if (!modelId) {
                    this._initialize();
                } else {
                    this.api.loadModel(modelId, {
                        onComplete: function (msg) {
                            self._initialize(msg.model)
                        },
                        onError: function (msg) {
                            alert(JSON.stringify(msg));
                        }
                    })
                }
            },

            _initialize: function (modelData) {
                var self = this;
                this._model = new Model(modelData);

                var $saveButton = $(".save-model");
                $saveButton.click(this._onSaveModelClick.bind(this));

                // render questions
                this._renderQuestions();
                var $addQuestionButton = $('#add-question');
                $addQuestionButton.click(function () {
                    var question = self._model.createQuestion();
                    self.addQuestionRow(self._model.getQuestions(), question);
                });

                // render orders
                this._renderOrders();
                var $addOrderButton = $('#add-order');
                $addOrderButton.click(function () {
                    var order = self._model.createOrder();
                    if (order)
                        self.addOrderRow(self._model.getOrders(), order);
                });
                
                // render attributes
                this._renderAttributes();
                var $addAttributeButton = $('#add-attribute');
                $addAttributeButton.click(function () {
                    var attribute = self._model.createAttribute();
                    self.addAttributeRow(self._model.getAttributes(), attribute);
                });

                // render derivation rules
                this._renderRules();
                var $addRuleButton = $('#add-rule');
                $addRuleButton.click(function () {
                    var rule = self._model.createRule();
                    self.addRuleRow(self._model.getRules(), rule);
                });

                // model name
                var $modelName = $('#model-name');
                $modelName.val(this._model.getName());

                $modelName.on('input', function () {
                    var name = $modelName.val();
                    self._model.setName(name);
                });

                // manage objects
                var $manageObjects = $('#manage-objects');
                $manageObjects.click(this._onManageObjectsClick.bind(this));

                // copy json to clipboard
                var $jsonButton = $('#copy-json');
                $jsonButton.click(function () {
                    var modelText = JSON.stringify(self._model.getData());
                    console.log("Model: ", self._model.getData());
                    window.prompt("Copy to clipboard: Ctrl+C, Enter", modelText);
                });
            },

            _renderQuestions: function () {
                this.$questionsTable = $('#questions-table');
                this.$questionsTable.find('tbody').empty();

                var questions = this._model.getQuestions();
                _.each(questions, function (question) {
                    this.addQuestionRow(questions, question);
                }, this);
            },

            _renderOrders: function () {
                this.$ordersTable = $('#orders-table');
                this.$ordersTable.find('tbody').empty();

                var orders = this._model.getOrders();
                _.each(orders, function (order) {
                    this.addOrderRow(orders, order);
                }, this);
            },

            _renderAttributes: function () {
                this.$attrbutesTable = $('#attributes-table');
                this.$attrbutesTable.find('tbody').empty();

                var attributes = this._model.getAttributes();
                _.each(attributes, function (question) {
                    this.addAttributeRow(attributes, question);
                }, this);
            },

            _renderRules: function () {
                this.$rulesTable = $('#rules-table');
                this.$rulesTable.find('tbody').empty();

                var rules = this._model.getRules();
                _.each(rules, function (rule) {
                    this.addRuleRow(rules, rule);
                }, this);
            },

            _onManageObjectsClick: function () {
                console.log("Model: ", this._model.getData());

                var method = this.api.createModel.bind(this.api);
                if (this._model.getId() != -1)
                    method = this.api.saveModel.bind(this.api);

                method(this._model.getData(), {
                    onComplete: function (msg) {
                        var modelId = msg._id;

                        history.replaceState(null, "", "/editor?modelId=" + modelId);
                        alert("Model saved successfully: " + modelId);
                        document.location.href = "/objectsManager?modelId=" + modelId;
                    },
                    onError: function (msg) {
                        alert(JSON.stringify(msg));
                    }
                });
            },

            _onSaveModelClick: function () {
                var self = this;

                console.log("Model: ", this._model.getData());

                var method = this.api.createModel.bind(this.api);
                if (this._model.getId() != -1)
                    method = this.api.saveModel.bind(this.api);

                method(this._model.getData(), {
                    onComplete: function (msg) {
                        var modelId = msg._id;

                        history.replaceState(null, "", "/editor?modelId=" + modelId);
                        self._model.setId(modelId);

                        alert("Model saved successfully: " + modelId);
                    },
                    onError: function (msg) {
                        alert(JSON.stringify(msg));
                    }
                });
            },

            addQuestionRow: function (questions, question) {
                var self = this;
                var context = _.extend(this._prepareContext(question));
                context.type = this._prepareSelect(this._questionTypes, question.type, "type");

                this.addRow(
                    this.$questionsTable,
                    this._templates.questionRow,
                    context, questions, question,
                    {
                        input: function ($field, key, oldValue, value) {
                            if (key == 'param') {
                                self._model.updateOrders(oldValue, value);
                            }

                            self._renderOrders();
                        },
                        remove: function (question) {
                            // remove orders associated with removed question
                            self._model.removeOrdersByQuestion(question);
                            self._renderOrders();
                        }
                    }
                );
            },

            addOrderRow: function (orders, order) {
                var self = this;

                var question = _.find(this._model.getQuestions(), function (question) {
                    return question.param == order.from;
                });

                var context = {
                    from: this._prepareSelect(this._prepareQuestionList(), order.from, "from"),
                    op: this._prepareSelect(this._orderOps, order.op, "op"),
                    value: this._prepareSelect(this._prepareValues(order.from), order.value, "value"),
                    to: this._prepareSelect(this._prepareQuestionList(), order.to, "to")
                };
                context.value.value = order.value;

                var template = question.type == 'choice'
                    ? this._templates.orderChoiceRow
                    : this._templates.orderInputRow;

                this.addRow(this.$ordersTable,
                    template,
                    context, orders, order,
                    {
                        input: function ($field, key, oldValue, value) {
                            if (key == 'from')
                                self._renderOrders();
                        }
                    });
            },

            addAttributeRow: function (attributes, attribute) {
                var context = _.extend(this._prepareContext(attribute), {
                    type: this._prepareSelect(this._questionTypes, attribute.type, "type")
                });

                this.addRow(this.$attrbutesTable, this._templates.attributeRow, context, attributes, attribute);
            },

            addRuleRow: function (rules, rule) {
                var context = this._prepareContext({
                    rule: rule.rule
                });

                this.addRow(this.$rulesTable, this._templates.ruleRow, context, rules, rule);
            },

            /**
             * Adds <tr> in $table
             * @param $table {jQuery}
             * @param template {Function}
             * @param context {Object} template parameters
             * @param objects {Array} collection, which contains row
             * @param object {Object}
             * @param hooks [{input: Function, remove: function}] cbs called on input and remove
             */
            addRow: function ($table, template, context, objects, object, hooks) {
                var self = this;

                var row = template(context);
                var $row = $(row);

                var $fields = $row.find('input, select');

                var handler = function (noHooks) {
                    var $field = $(this);
                    var key = $field.data('field');
                    var value = $field.val();

                    if (key == "values")
                        value = value.split(',');

                    console.log("Field changed: ", key, value);
                    var oldValue = object[key];
                    object[key] = value;

                    if (noHooks !== true && hooks && hooks.input) {
                        hooks.input($field, key, oldValue, value);
                    }
                };
                $fields.on('input', handler);

                var $removeButton = $row.find('.remove');
                $removeButton.click(function () {
                    objects.remove(object);
                    $row.fadeOut($row.remove.bind($row));

                    if (hooks && hooks.remove) {
                        hooks.remove(object);
                    }
                });

                $table.append($row);

                $fields.each(function () {
                    handler.call(this, true);
                });

                return $row;
            },

            _prepareContext: function (context) {
                return _.mapValues(context, function (value, key) {
                    return {
                        value: value,
                        field: key
                    };
                });
            },

            _prepareSelect: function (entries, selectedValue, fieldName) {
                entries = _.map(_.cloneDeep(entries), function (entry) {
                    if (entry.value == selectedValue)
                        entry.selected = "selected";

                    return entry;
                });

                return {
                    field: fieldName,
                    entries: entries
                };
            },

            _prepareQuestionList: function () {
                var questions = this._model.getQuestions();
                return _.map(questions, function (question) {
                    return {
                        value: question.param,
                        text: question.text
                    }
                });
            },

            _prepareValues: function (param) {
                var question = _.find(this._model.getQuestions(), function (question) {
                    return question.param == param;
                });
                var values = question.values;

                return _.map(values, function (value) {
                    return {
                        value: value,
                        text: value
                    }
                });
            },

            _loadTemplates: function () {
                this._partials = {
                    input: Templater.load('#input-template'),
                    select: Templater.load('#select-template'),
                    combobox: Templater.load('#combobox-template'),
                    operate: Templater.load('#operate-template'),
                };

                Templater.registerPartials(this._partials);

                this._templates = {
                    questionRow: Templater.load('#question-row-template'),
                    attributeRow: Templater.load('#attribute-row-template'),
                    ruleRow: Templater.load('#rule-row-template'),
                    orderChoiceRow: Templater.load('#order-choice-row-template'),
                    orderInputRow: Templater.load('#order-input-row-template')
                };
            }
        });
    
        return Editor;
    }
);