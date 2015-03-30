define(['jquery', 'jquery-ui', 'lodash'], function($, jqUI, _) {
    function showMessage(selector, message, cb) {
        var $dialog = $(selector);
        $dialog.find('.message-text').html(message);

        $dialog.dialog({
            width: "50%",
            modal: true,
            show: {
                effect: "fade",
                duration: 200
            },
            hide: {
                effect: "fade",
                duration: 200
            },
            buttons: {
                'OK': function () {
                    cb && cb();
                    $(this).dialog("close");
                }
            }
        });
    }

    return {
        showError: function (message, cb) {
            if (_.isEmpty(message))
                message = "Unknown error. Check your internet connection or blame developers";
            else if (!_.isEmpty(message.msg))
                message = message.msg + '<br>' + _.reduce(message.reason, function(value, result) {
                    return result + value + '<br>';
                });
            else if (!_.isEmpty(message.responseText))
                message = message.responseText;
            else
                message = JSON.stringify(message, null, 2);

            showMessage('#message-error', message);
        },

        showInfo: function (message, cb) {
            showMessage('#message-info', message, cb);
        },

        showSuccess: function (message, cb) {
            showMessage('#message-success', message, cb);
        }
    };
});
