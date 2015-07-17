/**
 * Created by Maximilian on 01.06.2015.
 */

bsUtilModule.provider("bsUtil.taskManager", [function () {

    "use strict";

    var PROVIDER = this;
    var tasks = {};

    /**
     * register a callback on a specific task
     * @param {String} task
     * @param {function(function(), function())} callback
     */
    PROVIDER.on = function(task, callback) {
        if (!angular.isFunction(callback)) {
            throw new Error('callback must be a function');
        }

        let taskArray = task.toString().split(' ');

        taskArray.forEach(function (taskString) {
            if (!tasks.hasOwnProperty(taskString)) {
                tasks[taskString] = [];
            }
            tasks[taskString].push(callback);
        });
    };

    PROVIDER.execute = function (task, eventObject = null) {
        console.log('EXECUTE', task);

        var injector = PROVIDER._injector;

        if (!tasks.hasOwnProperty(task)) {
            console.log("NO TASKS");
            return Promise.resolve();
        }

        if (tasks[task].length <= 0) {
            return Promise.resolve();
        }

        let executingTasks = tasks[task];

        let taskPromises = executingTasks.map((callback) => {
            let result;
            try {
                result = callback(eventObject, injector);
            } catch (e) {
                return Promise.reject(e);
            }

            return Promise.resolve(result);
        });

        return Promise.all(taskPromises)
            .then(() => {
            let rootScope = injector.get('$rootScope');
            try {
                rootScope.$digest();
            } catch(e) {
                console.log(e.message);
            }
        });

    };

    this.$get = ['$injector', function (injector) {
        PROVIDER._injector = injector;
        return PROVIDER;
    }];
}]);
