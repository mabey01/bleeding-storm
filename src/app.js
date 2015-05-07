/**
 * Created by Maximilian on 25.04.2015.
 */

'use strict';

angular.module('@@name', [
    'ngRoute',
    'pascalprecht.translate',
    'bsSession',
    'bsHome',
    'bsForms',
    'bsUtil',
    'bsLanguage'
])
    .constant('$backendURL', 'http://localhost:4444')
    .constant('$frontendURL', window.location.origin + window.location.pathname)

    .config(['$routeProvider', '$translateProvider', function (routeProvider, translate) {
        var translationEN = {
            HEADLINE: 'Hello and Welcome to bleeding-storm!'
        };

        var translationDE = {
            HEADLINE: 'Hallo und Willkommen bei bleeding-storm!'
        };

        translate
            .translations('en', translationEN)
            .translations('de', translationDE)
            .preferredLanguage('en');

        routeProvider.when('/:sessionID', {
           controller : 'bsSessionCtrl',
            resolve : {
              session : ['$route', 'bsSession.SessionRegistry', function(route, sessionRegistry) {
                  var sessionID = route.current.params.sessionID;
                  return sessionRegistry.getSession(sessionID);
              }]
            },
            templateUrl : 'templates/session/sessionCtrl.tpl.html'
        });
        routeProvider.otherwise({
            controller : 'bsHomeCtrl',
            templateUrl : 'templates/home/homeCtrl.tpl.html'
        })
    }])
    .run(['$http', function (http) {
    }])
;