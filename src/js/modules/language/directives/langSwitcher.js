/**
 * Created by Maximilian on 06.05.2015.
 */

bsLanguageModule.directive('bsLangSwitcher', ['$translate', function (translate) {
    return {
        restrict : 'E',
        templateUrl : 'templates/language/directives/bsLangSwitcher.tpl.html',
        link : function (scope, element) {
            var selector = element.find('select');

            selector.on('change', function(e) {
                var newLang = e.target.value;
                scope.$apply(function() {
                    translate.use(newLang);
                });

            })
        }
    }
}]);