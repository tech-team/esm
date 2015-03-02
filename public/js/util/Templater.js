define(['jquery', 'mustache'], function($, mustache) {
    /**
     * Load templates as strings.
     * To be able to use mustache on frontend - use singe braces only
     * eg. '{' instead '{{' and '}' instead '}}'
     */
    function load(selector) {
        var $template = $(selector);
        var str = $template.html();

        return str.replace(/{/g, "{{").replace(/}/g, "}}");
    }

    function render(template, params) {
        return mustache.render(template, params);;
    }

    return {
        load: load,
        render: render
    };
});
