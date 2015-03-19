define([], function() {
    var Model = Class.create({
        initialize: function (data) {
            if (data)
                this._load(data);
            else
                this._create();
        },

        _load: function (data) {
            this._data = data;
        },

        _create: function () {
            this._data = {
                _id: -1,
                name: "",
                questions: [],
                attributes: [],
                objects: [],
                derivation_rules: [],
                orderRules: []
            };

            this.createQuestion();
            this.createOrder();
            this.createAttribute();
            this.createRule();
        },

        getName: function () {
            return this._data.name;
        },

        setName: function (name) {
            this._data.name = name;
        },

        getQuestions: function () {
            return this._data.questions;
        },

        getOrders: function () {
            return this._data.orderRules;
        },

        getAttributes: function () {
            return this._data.attributes;
        },

        getRules: function () {
            return this._data.derivation_rules;
        },

        getObjects: function () {
            return this._data.objects;
        },

        /**
         * Add new empty question to model
         */
        createQuestion: function () {
            var question = {
                id: -1,
                text: "",
                param: "",
                type: "choice",
                values: []
            };

            this._data.questions.push(question);
            return question;
        },

        /**
         * Add new empty order rule to model
         */
        createOrder: function () {
            var order = {
                from: "",
                op: "==",
                value: "",
                to: ""
            };

            this._data.orderRules.push(order);
            return order;
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

            this._data.attributes.push(attribute);
            return attribute;
        },

        /**
         * Add new empty derivation rule to model
         */
        createRule: function () {
            var rule = {
                rule: ""
            };

            this._data.derivation_rules.push(rule);
            return rule;
        },

        /**
         * Adds new empty object to model
         */
        createObject: function () {
            var object = {
                name: "",
                attributes: {}
            };

            this._data.objects.push(object);
            return object;
        },

        getId: function () {
            return this._data._id;
        },

        setId: function (id) {
            this._data._id = id;
        },

        getData: function () {
            return this._data;
        },

        removeOrdersByQuestion: function (question) {
            this._data.orderRules = _.filter(this._data.orderRules, function (order) {
                return order.from != question.param && order.to != question.param;
            });
        },

        updateOrders: function (oldParamName, newParamName) {
            _.each(this._data.orderRules, function (order) {
                if (order.from == oldParamName)
                    order.from = newParamName;

                if (order.to == oldParamName)
                    order.to = newParamName;
            });
        }
    });

    return Model;
});