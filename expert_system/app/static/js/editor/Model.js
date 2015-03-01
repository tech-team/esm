define([], function() {
    var Model = Class.create({
        initialize: function (data) {
            this._parameters = null;

            if (data)
                this.load(data);
            else
                this._create();
        },

        _load: function (data) {

        },

        _create: function () {
            //TODO: stub
            this._parameters = [
                {
                    id: 0,
                    name: "параметр1",
                    type: "choice",
                    values: ["a", "b", "c"]
                },
                {
                    id: 0,
                    name: "параметр1",
                    type: "choice",
                    values: ["a", "b", "c"]
                },
                {
                    id: 0,
                    name: "параметр1",
                    type: "choice",
                    values: ["a", "b", "c"]
                }
            ];
        },

        getParameters: function () {
            return this._parameters;
        }
    });

    return Model;
});