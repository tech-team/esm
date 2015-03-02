define(['jquery', 'util/Templater', 'api/Exceptions', 'editor/Model'],
    function($, Templater, Exceptions, Model) {
        var Editor = Class.create({
            initialize: function (api) {
                this.model = new Model();
    
                this.templates = this.loadTemplates();
                
                var $parametersTable = $('#parameters-table');
    
    
                $parametersTable.bootstrapTable({
                    striped: true,
                    loading: false,
                    data: this.model.getParameters(),
    
                    columns: [
                        {
                            field: 'id',
                            title: 'ID',
                            formatter: this.textFieldFormatter.bind(this)
                        },
                        {
                            field: 'name',
                            title: 'Название',
                            formatter: this.inputFieldFormatter.bind(this),
                        },
                        {
                            field: 'type',
                            title: 'Тип',
                            formatter: this.selectFieldFormatter.bind(this),
                        },
                        {
                            field: 'values',
                            title: 'Значения',
                            formatter: this.inputFieldFormatter.bind(this),
                        },
                        {
                            field: 'operate',
                            title: "",
                            formatter: this.operateFieldFormatter.bind(this),
                            events: {
                                'click .edit': this.editRow.bind(this),
                                'click .remove': this.removeRow.bind(this)
                            }
                        }
                    ]
                });
            },
    
            loadTemplates: function () {
                return {
                    input: Templater.load('#input-template'),
                    select: Templater.load('#select-template'),
                    combobox: Templater.load('#combobox-template'),
                    operate: Templater.load('#operate-template')
                };
            },

            textFieldFormatter: function (value, row, index) {
                return value;
            },

            inputFieldFormatter: function (value, row, index) {
                return Templater.render(this.templates.input, {
                    value: value
                });
            },

            selectFieldFormatter: function (value, row, index) {
                //TODO: params: list, ids
                return Templater.render(this.templates.select);
            },

            comboboxFieldFormatter: function (value, row, index) {
                //TODO: params: list, ids
                return Templater.render(this.templates.combobox);
            },

            operateFieldFormatter: function (value, row, index) {
                return Templater.render(this.templates.operate);
            },
    
            editRow: function (e, value, row, index) {
                alert("editRow: " + row);
            },
    
            removeRow: function (e, value, row, index) {
                alert("removeRow: " + row);
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