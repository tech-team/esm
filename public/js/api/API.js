define(['jquery', 'api/Exceptions'], function($, Exceptions) {
    var API = Class.create({
        /**
         * Gets JSON stats report
         * @param callbacks {Object}
         * @param callbacks.onError {Function}
         * @param callbacks.onComplete {Function}
         */
        getReport: function (callbacks) {
            this._get("/api/client/results", null, callbacks);
        },

        init: function (modelId, callbacks) {
            this._post("/api/client/init", {
                id: modelId
            }, callbacks);
        },

        //TODO: define callbacks documentation somewhere in one place
        /**
         * Gets JSON stats report
         * @param answer {String}
         * @param callbacks {Object}
         * @param callbacks.onError {Function}
         * @param callbacks.onComplete {Function}
         */
        answer: function (answer, callbacks) {
            this._post("/api/client/answer", {
                answer: answer
            }, callbacks);
        },

        getModelList: function (callbacks) {
            this._get("/api/editor/model/list", null, callbacks);
        },

        loadModel: function (modelId, callbacks) {
            this._get("/api/editor/model", {
                id: modelId
            }, callbacks);
        },

        saveModel: function (model, callbacks) {
            this._post("/api/editor/model", model, callbacks);
        },

        _get: function (url, data, callbacks) {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: url,
                data: data
            })
                .done(function (msg) {
                    callbacks.onComplete(msg);
                })
                .fail(function (error) {
                    callbacks.onError(error.responseJSON);
                });
        },

        _post: function (url, data, callbacks) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: url,
                dataType: "json",
                data: JSON.stringify(data)
            })
                .done(function (msg) {
                    callbacks.onComplete(msg);
                })
                .fail(function (error) {
                    callbacks.onError(error.responseJSON);
                });
        }
    });

    return API;
});

