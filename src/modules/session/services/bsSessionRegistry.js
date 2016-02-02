/**
 * Created by Maximilian on 06.05.2015.
 */

bsSessionModule.service('bsSession.bsSessionRegistry', ['$http', '$backendURL', '$q', 'bsSession.bsSessionFactory', function (http, backendURL, q, sessionFactory) {

    var sessions = {};

    /**
     * constuct a new Session Object
     * @param {Object} rawSession
     * @returns {Session}
     */
    var constructSession = function (rawSession) {
        var newSession = sessionFactory.construct(rawSession);
        sessions[newSession.getID()] = newSession;
        return newSession;
    };

    /**
     * load a session by id
     * @param {String} sessionID
     * @returns {Promise}
     */
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
    };
}]);