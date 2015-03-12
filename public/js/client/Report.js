define(['jquery', 'lodash', 'util/Url', 'util/Templater'],
    function($, _, Url, Templater) {
        var Client = Class.create({
            initialize: function (api) {
                var self = this;

                this.api  = api;

                this.api.getReport({
                    onComplete: function (msg) {
                        if (msg.report) {
                            self.renderReport(msg.report);
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

            renderReport: function (report) {
                console.log(report);
                alert(JSON.stringify(report));
            }
        });

        return Client;
    }
);
