/**
 * Created by Maximilian on 06.05.2015.
 */

bsSessionModule.provider('bsSession.SessionRegistry', [function () {

    var sessions = {};

    this.$get = ['$http', '$backendURL', '$q', 'bsSession.SessionFactory', function (http, backendURL, q, sessionFactory) {

        var constructSession = function (rawSession) {
            var newSession = sessionFactory.construct(rawSession);
            sessions[newSession.getID()] = newSession;
            return newSession;
        };

        var loadSession = function(sessionID) {
            var deferred = q.defer();
            http.get(backendURL + '/session/' + sessionID)
                .success(function (data, status, headers, config) {
                    deferred.resolve(constructSession(data));
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                })
            ;

            return deferred.promise;
        };

        return {
            addSession : function (rawSession) {
                return constructSession(rawSession);
            },
            getSession : function(sessionID) {
                if (sessionID in sessions) {
                    return q.when( sessions[sessionID] );
                }

                return loadSession(sessionID);
            }
        }
    }]
}]);