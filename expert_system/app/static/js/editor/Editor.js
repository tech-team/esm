define(['jquery', 'mustache', 'api/Exceptions', 'editor/Model'], function($, Mustache, Exceptions, Model) {
    var Editor = Class.create({
        initialize: function (api) {
            this.model = new Model();

            var $parametersTable = $('#parameters-table');


            $parametersTable.bootstrapTable({
                striped: true,
                data: this.model.getParameters(),

                columns: [
                    {
                        field: 'id',
                        title: 'ID'
                    },
                    {
                        field: 'name',
                        title: 'Название'
                    },
                    {
                        field: 'type',
                        title: 'Тип'
                    },
                    {
                        field: 'values',
                        title: 'Значения'
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

        operateFieldFormatter: function (value, row, index) {

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
});