define(['jquery', 'handlebars'], function($, Handlebars) {
    /**
     * Load templates as strings.
     * To be able to use mustache on frontend - use singe braces only
     * eg. '{' instead '{{' and '}' instead '}}'
     */
    function load(selector) {
        var $template = $(selector);
        var str = $template.html();

        return Handlebars.compile(str.replace(/{/g, "{{").replace(/}/g, "}}"));
    }

    function registerPartials(partials) {
        Handlebars.registerPartial(partials);
    }

    return {
        load: load,
        registerPartials: registerPartials
    };
});
