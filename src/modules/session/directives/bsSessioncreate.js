/**
 * Created by Maximilian on 28.04.2015.
 */

bsSessionModule.directive('bsSessionCreate', ['$http', 'bsSession.bsSessionRegistry', function(http, sessionRegistry) {
    return {
        restrict : 'E',
        templateUrl : 'templates/session/create.tpl.html',
        link : function(scope, element, attrs , controller) {
            scope.submitted = false;
            scope.done = false;
            scope.newSession = null;

            scope.createAnother = function() {
                scope.submitted = false;
                scope.done = false;
                scope.newSession = null;
            };

            scope.submit = function(form) {
                scope.submitted = true;
                if (!('topic' in form)) return alert("Not Valid Topic");
                if (!('date' in form)) return alert("Not Valid Date");
                if (!('startingTime' in form)) return alert("Not valid Time");

                form.date.setHours(form.startingTime.hours);
                form.date.setMinutes(form.startingTime.minutes);

                var sessionObject = {
                    topic : form.topic,
                    startingTime : form.date,
                    duration :  (form.duration.hours * 60 * 60 * 1000) + (form.duration.minutes * 60 * 1000)
                };

                if ('description' in form) {
                    sessionObject.description = form.description;
                }

                http.post('http://localhost:4444/session', sessionObject)
                    .success(function(rawSessionData, status) {
                        scope.newSession = sessionRegistry.addSession(rawSessionData);
                        console.log(scope.newSession);
                        scope.done = true;
                    })
                    .error(function(data, status) {
                        scope.error = "Session could not be created";
                        scope.done = true;
                    });
            }
        }
    }
}]);