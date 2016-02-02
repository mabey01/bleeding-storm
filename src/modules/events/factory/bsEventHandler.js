/**
 * Created by Maximilian on 13.07.2015.
 */

bsEventsModule.factory('bsEvents.bsEventHandler', [function () {

    /**
     @class bsEventHandler
     @type {Object}
     @property {function(String, Function)} on
     @property {function(Function)} onAll
     @property {function()} offAll
     @property {function(Object)} bubbleEvents
     @property {function(String)} _trigger
     */

    /**
     *
     * @param {Object} specs
     * @returns {bsEventHandler}
     * @constructor
     */
    function bsEventHandlerFactory(specs) {
        let listeners = {};
        let universalListeners = [];

        return {
            /**
             * register a callback function to specific event
             * @param {String} eventName
             * @param {Function} callback
             */
            on(eventName, callback) {
                if (!angular.isString(eventName)) throw new Error('eventName is not a String');
                if (!angular.isFunction(callback)) throw new Error('callback is not a function');

                if (eventName in listeners) {
                    listeners[eventName].push(callback);
                } else {
                    listeners[eventName] = [callback];
                }
            },

            /**
             * register a callback function to all events
             * @param {Function} callback
             */
            onAll(callback) {
                universalListeners.push(callback);
            },

            /**
             * unregister all callbacks
             */
            offAll() {
                listeners = {};
                universalListeners = [];
            },

            /**
             * bubble events from object
             * @param {Object} object
             */
            bubbleEvents(object) {
                object.onAll((eventName, ...data) => this._trigger(eventName, ...data));
            },

            /**
             * trigger a specific event
             * @param {String} eventName
             * @param {Array} data
             */
            _trigger(eventName, ...data) {
                if (eventName in listeners) {
                    listeners[eventName].forEach((callback) => callback(...data));
                }

                universalListeners.forEach((callback) => {
                    callback(eventName, ...data);
                })
            }
        }
    }

    return {
        /**
         * construct a new bsEventHandler Object
         * @param {Object=} specs
         */
        construct(specs = {}) {
            return bsEventHandlerFactory(specs);
        }
    }
}]);