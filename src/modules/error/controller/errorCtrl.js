/**
 * Created by Maximilian on 14.07.2015.
 */

bsErrorModule.controller('bsErrorCtrl', ['$scope', 'Error.Handler',  function (scope, errorHandler) {

    'use strict';

    scope.errors = errorHandler.getErrors();
}]);
