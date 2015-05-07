/**
 * Created by Maximilian on 06.05.2015.
 */

bsUtilModule.directive('bsLoader', [function () {
    return {
        restrict : 'E',
        templateUrl : 'templates/util/directives/bsLoader.tpl.html',
        link : function (scope, element, attrs) {
            if ('size' in attrs) {
                var size = attrs.size;
                element.css('width', size);
                element.css('height', size);
            }
        }
    }
}]);