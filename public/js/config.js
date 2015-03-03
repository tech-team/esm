requirejs.config({
    baseUrl: '/static/js/lib/min',
    paths: {
        editor: '/static/js/editor',
        client: '/static/js/client/',
        test: '/static/js/test/',
        api: '/static/js/api/',
        util: '/static/js/util/'
    },
    shim: {
        'jquery.layout': {
            deps: [
                'jquery', 'jquery-ui'
            ]
        },
        'jquery.flot': {
            deps: [
                'jquery'
            ]
        },
        'bootstrap-table': {
            deps: [
                'jquery'
            ]
        }
    }
});


// default types extensions

/**
 * Removes item from array
 * @param item - value to remove
 */
Array.prototype.remove = function (item) {
    var i;
    while((i = this.indexOf(item)) !== -1) {
        this.splice(i, 1);
    }
};

/**
 * Adds all elements from arr
 * @param arr {Array}
 */
Array.prototype.pushArray = function(arr) {
    this.push.apply(this, arr);
};