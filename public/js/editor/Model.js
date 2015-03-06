define([], function() {
    var Model = Class.create({
        initialize: function (data) {
            this._questions = null;

            if (data)
                this.load(data);
            else
                this._create();
        },

        _load: function (data) {

        },

        _create: function () {
            //TODO: stub
            this._questions = [
                {
                    id: 0,
                    text: "Быть или не быть?",
                    parameter: "бытие",
                    type: "choice",
                    values: ["быть", "или", "не быть"]
                },
                {
                    id: 0,
                    text: "вопрос 1",
                    parameter: "параметр1",
                    type: "choice",
                    values: ["a", "b", "c"]
                },
                {
                    id: 0,
                    text: "вопрос 2",
                    parameter: "параметр1",
                    type: "number",
                    values: null
                }
            ];
        },

        getQuestions: function () {
            return this._questions;
        }
    });

    return Model;
});