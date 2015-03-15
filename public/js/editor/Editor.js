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
                $saveButton.click(function () {
                    console.log(self._model.getQuestions());
                });

                // render questions
                this.$questionsTable = $('#questions-table');
                var questions = this._model.getQuestions();
                _.each(questions, function (question) {
                    this.addQuestionRow(questions, question);
                }, this);

                var $addQuestionButton = $('#add-question');
                $addQuestionButton.click(function () {
                    var question = self._model.createQuestion();
                    self.addQuestionRow(questions, question);
                });

                // render attributes
                this.$attrbutesTable = $('#attributes-table');
                var attributes = this._model.getAttributes();
                _.each(attributes, function (question) {
                    this.addAttributeRow(attributes, question);
                }, this);

                var $addAttributeButton = $('#add-attribute');
                $addAttributeButton.click(function () {
                    var attribute = self._model.createAttribute();
                    self.addAttributeRow(attributes, attribute);
                });

                // render derivation rules
                this.$rulesTable = $('#rules-table');
                var rules = this._model.getRules();
                _.each(rules, function (rule) {
                    this.addRuleRow(rules, rule);
                }, this);

                var $addRuleButton = $('#add-rule');
                $addRuleButton.click(function () {
                    var rule = self._model.createRule();
                    self.addRuleRow(rules, rule);
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
            },

            _onManageObjectsClick: function () {
                this.api.saveModel(this._model.getData(), {
                    onComplete: function (msg) {
                        var modelId = msg.modelId;

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
                this.api.saveModel(this._model.getData(), {
                    onComplete: function (msg) {
                        var modelId = msg.modelId;

                        history.replaceState(null, "", "/editor?modelId=" + modelId);
                        alert("Model saved successfully: " + modelId);
                    },
                    onError: function (msg) {
                        alert(JSON.stringify(msg));
                    }
                });
            },

            addQuestionRow: function (questions, question) {
                var context = _.extend(this._prepareContext(question), {
                    type: this._prepareSelect(this._questionTypes, question.type)
                });

                this.addRow(this.$questionsTable, this._templates.questionRow, context, questions, question);
            },

            addAttributeRow: function (attributes, attribute) {
                var context = _.extend(this._prepareContext(attribute), {
                    type: this._prepareSelect(this._questionTypes, attribute.type)
                });

                this.addRow(this.$attrbutesTable, this._templates.attributeRow, context, attributes, attribute);
            },

            addRuleRow: function (rules, rule) {
                var context = this._prepareContext({
                    rule: rule
                });

                this.addRow(this.$rulesTable, this._templates.ruleRow, context, rules, rule);
            },

            /**
             * Adds <tr> in $table
             * @param $table {jQuery}
             * @param template {Function}
             * @param context {Object} template parameters
             * @param rows {Array} collection, which contains row
             * @param row {Object}
             */
            addRow: function ($table, template, context, rows, row) {
                var self = this;

                var questionRow = template(context);
                var $questionRow = $(questionRow);

                var $fields = $questionRow.find('input, select');
                $fields.on('input', function () {
                    var $field = $(this);
                    var key = $field.data('field');
                    var value = $field.val();

                    row[key] = value;
                });

                var $removeButton = $questionRow.find('.remove');
                $removeButton.click(function () {
                    rows.remove(row);
                    $questionRow.remove();
                });

                $table.append($questionRow);
            },

            _prepareContext: function (context) {
                return _.mapValues(context, function (value, key) {
                    return {
                        value: value,
                        field: key
                    };
                });
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
                    select: Templater.load('#select-template'),
                    combobox: Templater.load('#combobox-template'),
                    operate: Templater.load('#operate-template'),
                };

                Templater.registerPartials(this._partials);

                this._templates = {
                    questionRow: Templater.load('#question-row-template'),
                    attributeRow: Templater.load('#attribute-row-template'),
                    ruleRow: Templater.load('#rule-row-template')
                };
            }
        });
    
        return Editor;
    }
);