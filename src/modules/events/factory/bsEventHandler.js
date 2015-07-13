/**
 * Created by Maximilian on 13.07.2015.
 */

bsEventsModule.factory('bsEvents.bsEventHandler', [function () {

    let bsEventHandlerFactory = function (specs) {
        let listeners = {};

        return {
            on(eventName, callback) {
                if (!angular.isString(callback)) throw new Error('eventNme is not a String');
                if (!angular.isFunction(callback)) throw new Error('callback is not a function');


                console.log(callback.toString());
                if (eventName in listeners) {
                    listeners[eventName].push(callback);
                } else {
                    listeners[eventName] = [callback];
                }
            },

            off(eventName, callback) {

            },

            unbindAll() {
                listeners = {};
            },

            _trigger(eventName, data) {
                if (eventName in listeners) {
                    listeners[eventName].forEach((callback) => callback(data));
                }
            }
        }
    };

    return {
        construct() {
            return bsEventHandlerFactory();
        }
    }
}]);