define(['jquery', 'lodash', 'util/Url', 'util/Templater'],
    function($, _, Url, Templater) {
        var Poll = Class.create({
            initialize: function (api) {
                var self = this;

                this.api  = api;

                this.currentQuestion = null;

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

            getNextQuestion: function () {
                var self = this;

                var $questionForm = this.$questionContainer.find('.ajax')[0];
                if (!$questionForm.checkValidity())
                    return false;

                var $answer = null;
                var answer = null;

                if (this.currentQuestion.type == 'choice') {
                    $answer = this.$questionContainer.find("input[name=answer]:checked");
                    answer = $answer.val();
                } else {
                    $answer = this.$questionContainer.find("input[name=answer]");
                    answer = parseFloat($answer.val());
                }

                this.api.answer(answer, {
                    onComplete: function (msg) {
                        if (msg.question) {
                            self.renderQuestion(
                                self.prepareQuestion(msg.question));
                        } else {
                            window.location.href = "/report";
                        }
                    },
                    onError: function (e) {
                        alert(JSON.stringify(e));
                        console.error(e);
                    }
                });
            },

            renderQuestion: function (question) {
                var self = this;

                if (!question) {
                    return;
                }

                this.currentQuestion = question;

                var questionStr = this.templates[question.type](question);
                var $question = $(questionStr);

                // prevent the form from doing a submit
                // but keep validation working
                $question.on('submit','.ajax',function (e) {
                    e.preventDefault();
                    return false;
                });

                var $nextButton = $question.find(".next");
                $nextButton.click(function (e) {
                    self.getNextQuestion();
                });

                this.$questionContainer.empty();
                $question.appendTo(this.$questionContainer);
            },

            /**
             * Changes values to pairs: {identifier: 'some_value', spaced: 'some value'}
             * @param question
             */
            prepareQuestion: function(question) {
                if (!question) {
                    alert("Error: No question retrieved from server!");
                    return;
                }

                _.each(question.values, function (value, id) {
					var v = String(value);
                    question.values[id] = {
                        identifier: v,
                        spaced: v.replace(/_/g, ' ').trim()
                    };
                });
				return question;
            }
        });

        return Poll;
    }
);
