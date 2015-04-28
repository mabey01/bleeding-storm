/**
 * Created by Maximilian on 25.04.2015.
 */

'use strict';

angular.module('@@name', [
    'ngRoute',
    'bsSession',
    'bsHome',
    'bsForms'
])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({
            controller : 'bsHomeCtrl',
            templateUrl : 'templates/home/home.tpl.html'
        })
    }]);