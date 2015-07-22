/**
 * Created by Maximilian on 13.07.2015.
 */

bsEventsModule.factory('bsEvents.bsEventHandler', [function () {

    function bsEventHandlerFactory(specs) {
        let listeners = {};
        let universalCallbacks = [];

        return {
            on(eventName, callback) {
                if (!angular.isString(eventName)) throw new Error('eventName is not a String');
                if (!angular.isFunction(callback)) throw new Error('callback is not a function');

                if (eventName in listeners) {
                    listeners[eventName].push(callback);
                } else {
                    listeners[eventName] = [callback];
                }
            },

            onAll(callback) {
                universalCallbacks.push(callback);
            },

            off(eventName, callback) {

            },

            offAll() {
                listeners = {};
                universalCallbacks = [];
            },

            bubbleEvents(object) {
                object.onAll((eventName, ...data) => this._trigger(eventName, ...data));
            },

            _trigger(eventName, ...data) {
                if (eventName in listeners) {
                    listeners[eventName].forEach((callback) => callback(...data));
                }

                universalCallbacks.forEach((callback) => {
                    callback(eventName, ...data);
                })
            }
        }
    }

    return {
        construct(specs = {}) {
            return bsEventHandlerFactory(specs);
        }
    }
}]);