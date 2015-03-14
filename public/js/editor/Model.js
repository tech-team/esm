define([], function() {
    var Model = Class.create({
        initialize: function (data) {
            this._questions = null;
            this._attributes = null;
            this._objects = null;

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
                    id: 1,
                    text: "Быть или не быть?",
                    parameter: "бытие",
                    type: "choice",
                    values: ["быть", "или", "не быть"]
                },
                {
                    id: 2,
                    text: "вопрос 1",
                    parameter: "параметр1",
                    type: "choice",
                    values: ["a", "b", "c"]
                },
                {
                    id: 3,
                    text: "вопрос 2",
                    parameter: "параметр1",
                    type: "number",
                    values: null
                }
            ];

            this._attributes = [];
            this.createAttribute();

            this._objects = [];
            this.createObject();
        },

        getQuestions: function () {
            return this._questions;
        },

        getAttributes: function () {
            return this._attributes;
        },

        getObjects: function () {
            return this._objects;
        },

        /**
         * Add new empty question to model
         */
        createQuestion: function () {
            var question = {
                id: -1,
                text: "",
                parameter: "",
                type: "choice",
                values: []
            };

            this._questions.push(question);
            return question;
        },

        /**
         * Adds new empty attribute to model
         */
        createAttribute: function () {
            var attribute = {
                id: -1,
                name: "",
                type: "choice",
                values: []
            };

            this._attributes.push(attribute);
            return attribute;
        },

        /**
         * Adds new empty object to model
         */
        createObject: function () {
            var object = {

            };

            this._objects.push(object);
            return object;
        }
    });

    return Model;
});