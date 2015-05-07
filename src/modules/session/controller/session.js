/**
 * Created by Maximilian on 06.05.2015.
 */

bsSessionModule.controller('bsSessionCtrl', ['$scope', 'session', function(scope, session) {
    scope.session = session;
}]);