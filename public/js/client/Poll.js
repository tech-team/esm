define(['jquery', 'lodash', 'util/Url', 'util/Templater'],
    function($, _, Url, Templater) {
        var Poll = Class.create({
            initialize: function (api) {
                var self = this;

                this.api  = api;

                this.$questionContainer = $('#question-container');
                this.templates = {
                    choice: Templater.load('#choice-template'),
                    number: Templater.load('#number-template')
                };

                var modelId = Url.getParams().modelId;

                this.api.init(modelId, {
                    onComplete: function (msg) {
                        self.renderQuestion(
                            self.prepareQuestion(msg.question));
                    },
                    onError: function (e) {
                        alert(JSON.stringify(e));
                        console.error(e);
                    }
                });
            },

            renderQuestion: function (question) {
                var questionStr = this.templates[question.type](question);
                var $question = $(questionStr);

                this.$questionContainer.empty();
                $question.appendTo(this.$questionContainer);
            },

            /**
             * Changes values to pairs: {identifier: 'some_value', spaced: 'some value'}
             * @param question
             */
            prepareQuestion: function(question) {
                _.each(question.values, function (value, id) {
                    question.values[id] = {
                        identifier: value,
                        spaced: value.replace('_', ' ')
                    };
                });
            }
        });

        return Poll;
    }
);
