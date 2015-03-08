"use strict";
var _ = require('lodash');

class TestRunner {
    static run(clazz) {
        var clazzInstance = new clazz();

        var totalTests = 0;
        var succeededTests = 0;

        var setupMethod = null;
        if (clazz.prototype.setUp) {
            setupMethod = clazz.prototype.setUp.bind(clazzInstance);
        } else {
            setupMethod = function() {};
        }

        _.forOwn(clazz.prototype, function (method) {
            if (_.isFunction(method) && /^test/.test(method.name)) {
                ++totalTests;
                console.info("-------[TEST] " + clazz.name + "." + method.name + " started");
                try {
                    setupMethod();
                    method.apply(clazzInstance);
                    ++succeededTests;
                } catch(e) {
                    console.error("-------[TEST] " + clazz.name + "." + method.name + " failed");
                    console.error(e.stack);
                    console.info();

                    return true;
                }
                console.info("-------[TEST] " + clazz.name + "." + method.name + " finished");
                console.info();
            }
        });

        console.info(succeededTests + "/" + totalTests + " tests finished successfully.");
    }
}

module.exports = TestRunner;