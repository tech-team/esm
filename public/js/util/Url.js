define([], function() {
    /**
     * @returns {Object} {key: value, ...}
     */
    function getParams() {
        var queryDict = {};

        location.search
            .substr(1)
            .split("&")
            .forEach(function (item) {
                var pair = item.split("=");
                queryDict[pair[0]] = pair[1];
            });

        return queryDict;
    }

    return {
        getParams: getParams
    };
});
