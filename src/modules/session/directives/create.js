/**
 * Created by Maximilian on 28.04.2015.
 */

bsSessionModule.directive('bsSessionCreate', ['$http', 'bsSession.SessionRegistry', function(http, sessionRegistry) {
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
                if (!('time' in form)) return alert("Not valid Time");

                form.date.setHours(form.time.hours);
                form.date.setMinutes(form.time.minutes);
                var createObject = {
                    topic : form.topic,
                    timestamp : form.date
                };

                http.post('http://localhost:4444/session', createObject)
                    .success(function(rawSessionData, status) {
                        scope.newSession = sessionRegistry.addSession(rawSessionData);
                        scope.done = true;
                    })
                    .error(function(data, status) {
                        console.log(data);
                    });
            }
        }
    }
}]);