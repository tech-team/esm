define(['jquery', 'lodash', 'util/Templater', 'api/Exceptions', 'editor/Model'],
    function($, _, Templater, Exceptions, Model) {
        var Editor = Class.create({
            initialize: function (api) {
                var self = this;

                this._model = new Model();
    
                this._templates = this._loadTemplates();

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
                    var question = {
                            id: -1,
                            text: "",
                            parameter: "",
                            type: "choice",
                            values: []
                    };
                    questions.push(question);
                    self.addQuestionRow(questions, question);
                });
            },

            addQuestionRow: function (questions, question) {
                var context = _.extend(this._prepareContext(question), {
                    type: this._prepareSelect(this._questionTypes, question.type)
                });
                var questionRow = this._templates.questionRow(context);
                var $questionRow = $(questionRow);

                var $fields = $questionRow.find('input, select');
                $fields.on('input', function () {
                    var $field = $(this);
                    var key = $field.data('field');
                    var value = $field.val();

                    question[key] = value;
                });

                var $removeButton = $questionRow.find('.remove');
                $removeButton.click(function () {
                    questions.remove(question);
                    $questionRow.remove();
                });

                this.$questionsTable.append($questionRow);
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
                var partials = {
                    input: Templater.load('#input-template'),
                    select: Templater.load('#select-template'),
                    combobox: Templater.load('#combobox-template'),
                    operate: Templater.load('#operate-template'),
                };

                Templater.registerPartials(partials);

                return {
                    questionRow: Templater.load('#question-row-template')
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