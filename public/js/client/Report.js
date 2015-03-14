define(['jquery', 'lodash', 'util/Url', 'util/Templater'],
    function($, _, Url, Templater) {
        var Client = Class.create({
            initialize: function (api) {
                var self = this;
                this.api  = api;

                this.$resultsTable = $("#results-table");

                this.api.getReport({
                    onComplete: function (msg) {
                        if (msg.attrs && msg.objects) {
                            self.renderReport(msg.attrs, msg.objects);
                        } else {
                            alert("Report is not ready!");
                        }
                    },
                    onError: function (e) {
                        alert(JSON.stringify(e));
                        console.error(e);
                    }
                });
            },

            renderReport: function (attrs, results) {
                var columns = _.map(attrs, function (attrValue, attrName) {
                    return {
                        field: attrName,
                        title: attrName.replace("_", " ")
                    }
                });

                this.$resultsTable.bootstrapTable({
                    columns: columns,
                    striped: true,
                    data: results
                });
                this.$resultsTable.bootstrapTable('hideLoading');
            }
        });

        return Client;
    }
);
