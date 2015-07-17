/**
 * Created by Maximilian on 16.05.2015.
 */

/**
 * angular module initialize
 * @type {Object}
 * @public
 */
let moduleInitialize = angular.module("bsInitialize", [])
    .run(['Initialize.initializer', function (initializer) {
        initializer.start();
    }]);
