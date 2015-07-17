/**
 * Created by Maximilian on 18.07.2014.
 */

moduleCore.provider("bsUtil.routeHandler", ['Core.taskManagerProvider', function (taskManager) {

    var provider = {};

    this.$get = ['$route', '$location', '$rootScope', 'bsError.errorHandler', function (routes, location, userProvider, rootScope, errorHandler) {

        provider._getRouteFromUrl = function (url) {
            var hasHash = Boolean(url.indexOf('/#/') + 1);
            var path = '';
            if (hasHash) {
                path = url.substring(url.indexOf('/#/')).replace('/#', '');
            } else {
                path = url.replace(/http:\/\/[a-zA-Z.]+/, '');
            }

            for (var i in routes.routes) {
                var route = routes.routes[i];
                if (route.hasOwnProperty('regexp') && route.regexp.test(path)) {
                    return route;
                }
            }

            return null;
        };

        provider.redirect = function (redirectTo) {
            var currentPath = location.path();

            var canRouteChange = provider.canChangeRoute(currentPath, redirectTo);
            console.log('can route change ', canRouteChange, redirectTo);
            if (canRouteChange) {
                location.path(redirectTo);

                if (!rootScope.$$phase) {
                    rootScope.$apply();
                }
            }
        };

        provider.canChangeRoute = function (current, next) {
            var currentRoute = current || null;
            var nextRoute = next || null;

            if (angular.isString(currentRoute)) {
                currentRoute = provider._getRouteFromUrl(current);
            }

            if (angular.isString(nextRoute)) {
                nextRoute = provider._getRouteFromUrl(next);
            } else if (nextRoute === null) {
                nextRoute = routes.current.$$route;
            }

            var systemErrors = errorHandler.getErrors();
            if (nextRoute.originalPath !== '/error' && systemErrors.length > 0) {
                return false;
            } else if (nextRoute.originalPath === '/error' && systemErrors.length > 0) {
                return true;
            } else if (nextRoute.originalPath === '/error' && systemErrors.length <= 0) {
                return false;
            }

            return true;
        };

        provider.redirectToDefault = function () {
            if (errorHandler.getErrors().length > 0) {
                provider.redirect('/');
            } else {
                provider.redirect('/error');
            }
        };

        provider.reload = function () {
            routes.reload();
        };

        return provider;
    }];
}]);
