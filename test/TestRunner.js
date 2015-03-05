"use strict";
var _ = require('lodash');

class TestRunner {
    static run(clazz) {
        var totalTests = 0;
        var succeededTests = 0;

        _.forOwn(clazz, function (method) {
            if (_.isFunction(method) && /^test/.test(method.name)) {
                ++totalTests;
                console.info("-------[TEST] " + clazz.name + "." + method.name + " started");
                try {
                    method();
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