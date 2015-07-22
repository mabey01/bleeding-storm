/**
 * Created by Maximilian on 25.04.2015.
 */

'use strict';

angular.module('bleeding-storm', [
    'ngRoute',
    'pascalprecht.translate',
    'bsUtil',
    'bsSocket',
    'bsSession',
    'bsHome',
    'bsForms',
    'bsImages',
    'bsLanguage',
    'bsMindmap',
    'bsEvents'
])
    .constant('$backendURL', 'http://localhost:4444')
    .constant('$frontendURL', window.location.origin + window.location.pathname)

    .config(['$routeProvider', '$translateProvider', function (routeProvider, translate) {
        var translationEN = {
            HEADLINE: 'Hello and Welcome to bleeding-storm!',
            ACTIVE_USER : 'Active User',
            TIME_LEFT : 'Time left',
            COUNTDOWN_EXPIRED: 'Countdown expired',
            CREATE_SESSION : {
                HEADLINE : 'Create new Session',
                TOPIC : 'Topic',
                DESCRIPTION : 'Description',
                DATE: 'Date',
                TIME: 'Time',
                DURATION: 'Duration',
                CREATE : 'Create',
                CONFIRMATION :'Your Session was successfully created! Here is the link to your session',
                CREATE_ANOTHER : 'Create another Session'
            }
        };

        var translationDE = {
            HEADLINE: 'Hallo und Willkommen bei bleeding-storm!',
            ACTIVE_USER : 'Aktive Benutzer',
            TIME_LEFT : 'Verbleibende Zeit',
            COUNTDOWN_EXPIRED: 'Countdown abgelaufen',
            CREATE_SESSION : {
                HEADLINE : 'Neues Meeting erstellen',
                TOPIC : 'Thema',
                DESCRIPTION : 'Beschreibung',
                DATE: 'Datum',
                TIME: 'Zeit',
                DURATION : 'Dauer',
                CREATE : 'Erstellen',
                CONFIRMATION :'Ihr Meeting wurde erfolgreich erstellt! Hier ist der Link für ihr Meeting',
                CREATE_ANOTHER : 'Weitere Meetings erstellen'
            }
        };

        translate
            .useSanitizeValueStrategy('escaped')
            .translations('en', translationEN)
            .translations('de', translationDE)
            .preferredLanguage('en');

        routeProvider.when('/:sessionID', {
           controller : 'bsSessionCtrl',
            resolve : {
              session : ['$route', 'bsSession.sessionRegistry', function(route, sessionRegistry) {
                  var sessionID = route.current.params.sessionID;
                  return sessionRegistry.getSession(sessionID);
              }]
            },
            templateUrl : 'templates/session/sessionCtrl.tpl.html'
        });
        routeProvider.when('/error', {
            controller : 'bsErrorCtrl',
            templateUrl : 'templates/error/errorCtrl.tpl.html'
        });
        routeProvider.otherwise({
            controller : 'bsHomeCtrl',
            templateUrl : 'templates/home/homeCtrl.tpl.html'
        })
    }])
    .run([function () {
    }])
;