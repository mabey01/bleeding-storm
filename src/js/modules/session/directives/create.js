/**
 * Created by Maximilian on 28.04.2015.
 */

bsSessionModule.directive('bsSessionCreate', ['$http', function(http) {
    return {
        restrict : 'E',
        templateUrl : 'templates/session/create.tpl.html',
        link : function(scope, element, attrs , controller) {
            console.log("CREATE SESSION");

            scope.submit = function(form) {
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
                    .success(function(data, status) {
                        console.log(data);
                    })
                    .error(function(data, status) {
                        console.log(data);
                    });
            }
        }
    }
}]);