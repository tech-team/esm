define(['jquery', 'jquery-ui'], function($, jqUI) {
    function showMessage(selector, message) {
        $(selector).dialog({
            width: "50%",
            modal: true,
            show: {
                effect: "fade",
                duration: 300
            },
            hide: {
                effect: "fade",
                duration: 300
            },
            buttons: {
                Ok: function () {
                    $(this).dialog("close");
                }
            }
        });
    }

    return {
        showError: function (message) {
            showMessage('#message-error', message);
        },

        showInfo: function (message) {
            showMessage('#message-info', message);
        },

        showSuccess: function (message) {
            showMessage('#message-success', message);
        }
    };
});
