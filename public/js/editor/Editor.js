define(['jquery', 'util/Templater', 'api/Exceptions', 'editor/Model'],
    function($, Templater, Exceptions, Model) {
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

                var $questionsTable = $('#questions-table');
                $questionsTable.bootstrapTable({
                    striped: true,
                    loading: false,
                    data: this._model.getQuestions(),
    
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
                            formatter: this._inputFieldFormatter.bind(this)
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
                    value: value
                });
            },

            _selectFieldFormatter: function (entries, value, row, index) {
                //TODO: params: list, ids
                return Templater.render(this._templates.select, {
                    entries: entries
                });
            },

            _comboboxFieldFormatter: function (entries, value, row, index) {
                //TODO: params: list, ids
                return Templater.render(this._templates.combobox);
            },

            _operateFieldFormatter: function (value, row, index) {
                return Templater.render(this._templates.operate);
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