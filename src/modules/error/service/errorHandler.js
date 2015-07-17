/**
 * Created by Maximilian on 14.07.2015.
 */

bsErrorModule.provider('bsError.errorHandler', [function () {
    'use strict';

    let errors = [];

    let raise = function (error) {
        errors.push(error);
    };

    let getErrors = function() {
        return errors
    };

    this.$get = [function () {
        return {
            raise : raise,
            getErrors : getErrors
        };
    }];
}]);
