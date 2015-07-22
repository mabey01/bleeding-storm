/**
 * Created by Maximilian on 22.07.2015.
 */
bsMindmapModule.directive('bsSessionInformationPrompt', [function () {
    return {
        restrict: 'E',
        scope : {
            session : '='
        },
        templateUrl : 'templates/mindmap/bsSessionInformationPrompt.tpl.html',
        link: function(scope, element, attrs) {
            const session = scope.session;

            scope.activeUsers = 1;

            session.on("updateUser", (newUserNumber) => {
                scope.activeUsers = newUserNumber;
                scope.$apply();
            });

            scope.endtime = session.getEndTime().getTime();
        }
    }
}]);