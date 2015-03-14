define(['jquery', 'lodash', 'util/Templater', 'api/Exceptions', 'editor/Model'],
    function($, _, Templater, Exceptions, Model) {
        var Editor = Class.create({
            initialize: function (api) {
                var self = this;

                this._model = new Model();
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

                var $saveButton = $(".save-model");
                $saveButton.click(function () {
                    console.log(self._model.getQuestions());
                });

                //render question
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

                //render attributes
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

            /**
             * Adds <tr> in $table
             * @param $table {jQuery}
             * @param template {Function}
             * @param context {Object} template parameters
             * @param rows {Array} collection, which contains row
             * @param row {Object}
             */
            addRow: function ($table, template, context, rows, row) {
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
                    attributeRow: Templater.load('#attribute-row-template')
                };
            },

    
            // button click handlers
            onLoadModelClick: function () {
    
            },
    
            onCreateModelClick: function () {
    
            },
    
            onSaveModelClick: function () {
    
            }
        });
    
        return Editor;
    }
);