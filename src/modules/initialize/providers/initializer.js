/**
 * Created by Maximilian on 01.06.2014.
 */

moduleInitialize.provider("Initialize.initializer", [function () {

    "use strict";

    var provider = {};
    let isInitialized = false;
    let isApplicationStarted = false;

    /**
     * INITIAL EVENT CIRCLE
     * 1. initialize
     * 2. initialized
     * 2. fireInitialRequests
     * 5. applicationStart
     */

    this.$get = ["bsUtil.taskManager", '$rootScope', 'Core.routeHandler', 'Initialize.registerSetup', 'bsError.errorHandler', function (taskManager, rootScope, routeHandler, registerSetup, errorHandler) {
        provider.initialize = function () {
            return taskManager.execute('initialize')
                .then(registerSetup.initializeRegisters.bind(registerSetup))
                .then(taskManager.execute.bind(taskManager, 'initialized'))
                .then(taskManager.execute.bind(taskManager, 'fireInitialRequests'))
        };

        provider.start = function () {
            rootScope.$on('$locationChangeStart', function (event, next, current) {
                if (isInitialized) {
                    if (!routeHandler.canChangeRoute(current, next)) {
                        event.preventDefault();
                    }
                } else {
                    event.preventDefault();
                    provider.initialize().then(
                        () => {
                            isInitialized = true;
                            var canRouteChange = routeHandler.canChangeRoute(current, next);
                            if (canRouteChange) {
                                routeHandler.reload();
                            } else {
                                routeHandler.redirectToDefault();
                            }
                        },
                        (reason) => {
                            errorHandler.raise(reason);
                            provider._initialized = true;
                            routeHandler.redirectToDefault();
                        });
                }
            });

            rootScope.$on('$routeChangeSuccess', function (event, route) {
                if (!isApplicationStarted) {
                    taskManager.execute('applicationStart');
                    isApplicationStarted = true;
                }
            });
        };

        return provider;
    }];

}]);
