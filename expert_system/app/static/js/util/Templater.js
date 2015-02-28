define(['jquery'], function($) {
    /**
     * Load templates as strings.
     * To be able to use mustache on frontend - use singe braces only
     * eg. '{' instead '{{' and '}' instead '}}'
     */
    function makeTemplate(selector) {
        var $template = $(selector);
        var str = $template.html();

        return str.replace(/{/g, "{{").replace(/}/g, "}}");
    }

    return {
        makeTemplate: makeTemplate
    };
});
