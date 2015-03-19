define(['jquery', 'lodash', 'util/Url', 'util/Templater'],
    function($, _, Url, Templater) {
        var Client = Class.create({
            initialize: function (api) {
                var self = this;
                this.api  = api;

                this._loadTemplates();

                this.$resultsContainer = $("#results-container");

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

            renderReport: function (attrs, objects) {
                _.each(objects, function (object) {
                    this.addObject(attrs, object);
                }, this);
            },

            addObject: function (attrs, object) {
                var renderedAttrs = _.map(attrs, function (attrValue, attrName) {
                    var name = attrName.replace("_", " ");
                    var value = object.o.attributes[name];

                    return {
                        attrName: name,
                        attrValue: value
                    };
                }, this);

                var card = this._templates.card({
                    name: object.o.name,
                    rating: object.rank,
                    attrs: renderedAttrs
                });

                var $card = $(card);
                $card.appendTo(this.$resultsContainer);
            },

            _loadTemplates: function () {
                this._templates =  {
                    card: Templater.load('#card-template')
                };
            }
        });

        return Client;
    }
);
