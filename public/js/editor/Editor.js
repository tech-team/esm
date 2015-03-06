define(['jquery', 'lodash', 'util/Templater', 'api/Exceptions', 'editor/Model'],
    function($, _, Templater, Exceptions, Model) {
        var Editor = Class.create({
            initialize: function (api) {
                this._model = new Model();
    
                this._templates = this._loadTemplates();

                this._valueTypes = [
                    {
                        value: "choice",
                        text: "Выбор"
                    },
                    {
                        value: "number",
                        text: "Число"
                    }
                ];

                var questions = this._model.getQuestions();

                var $questionsTable = $('#questions-table');
                $questionsTable.bootstrapTable({
                    striped: true,
                    data: questions,
                    onAll: function (name, args) {
                        console.log('Event: onAll, data: ', args);
                    },
                    onClickRow: function (row) {
                        console.log('Event: onClickRow, data: ' + JSON.stringify(row));
                    },
                    onDblClickRow: function (row) {
                        console.log('Event: onDblClickRow, data: ' + JSON.stringify(row));
                    },
                    onSort: function (name, order) {
                        console.log('Event: onSort, data: ' + name + ', ' + order);
                    },
                    onCheck: function (row) {
                        console.log('Event: onCheck, data: ' + JSON.stringify(row));
                    },
                    onUncheck: function (row) {
                        console.log('Event: onUncheck, data: ' + JSON.stringify(row));
                    },
                    onCheckAll: function () {
                        console.log('Event: onCheckAll');
                    },
                    onUncheckAll: function () {
                        console.log('Event: onUncheckAll');
                    },
                    onLoadSuccess: function (data) {
                        console.log('Event: onLoadSuccess, data: ' + data);
                    },
                    onLoadError: function (status) {
                        console.log('Event: onLoadError, data: ' + status);
                    },
                    onColumnSwitch: function (field, checked) {
                        console.log('Event: onSort, data: ' + field + ', ' + checked);
                    },
                    onPageChange: function (number, size) {
                        console.log('Event: onPageChange, data: ' + number + ', ' + size);
                    },
                    onSearch: function (text) {
                        console.log('Event: onSearch, data: ' + text);
                    },
                    columns: [
                        {
                            field: 'id',
                            title: 'ID',
                            formatter: this._textFieldFormatter.bind(this)
                        },
                        {
                            field: 'text',
                            title: 'Текст',
                            formatter: this._inputFieldFormatter.bind(this)
                        },
                        {
                            field: 'parameter',
                            title: 'Параметр',
                            formatter: this._inputFieldFormatter.bind(this)
                        },
                        {
                            field: 'type',
                            title: 'Тип',
                            formatter: this._selectFieldFormatter.bind(
                                this,
                                this._valueTypes)
                        },
                        {
                            field: 'values',
                            title: 'Значения',
                            formatter: this._inputFieldFormatter.bind(this),
                            events: {
                                'click .values': function () {
                                    alert("click .values");
                                }
                            }
                        },
                        {
                            field: 'operate',
                            title: "",
                            formatter: this._operateFieldFormatter.bind(this),
                            events: {
                                'click .edit': this._editRow.bind(this),
                                'click .remove': this._removeRow.bind(this)
                            }
                        }
                    ]
                });
                $questionsTable.bootstrapTable('hideLoading');

                //set types
                _.each(questions, function (question) {
                    var $select = $questionsTable
                        .find("[data-entry-id=" + question.id + "]");

                    $select.val(question.type);
                });
            },
    
            _loadTemplates: function () {
                return {
                    input: Templater.load('#input-template'),
                    select: Templater.load('#select-template'),
                    combobox: Templater.load('#combobox-template'),
                    operate: Templater.load('#operate-template')
                };
            },

            _textFieldFormatter: function (value, row, index) {
                return value;
            },

            _inputFieldFormatter: function (value, row, index) {
                return Templater.render(this._templates.input, {
                    value: value,
                    entry_id: row.id
                });
            },

            _selectFieldFormatter: function (entries, value, row, index) {
                //TODO: params: list, ids
                return Templater.render(this._templates.select, {
                    entries: entries,
                    entry_id: row.id
                });
            },

            _comboboxFieldFormatter: function (entries, value, row, index) {
                //TODO: params: list, ids
                return Templater.render(this._templates.combobox, {
                    entries: entries,
                    entry_id: row.id
                });
            },

            _operateFieldFormatter: function (value, row, index) {
                return Templater.render(this._templates.operate, {
                    entry_id: row.id
                });
            },
    
            _editRow: function (e, value, row, index) {
                alert("_editRow: " + row);
            },
    
            _removeRow: function (e, value, row, index) {
                alert("_removeRow: " + row);
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