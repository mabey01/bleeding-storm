/**
 * Created by Maximilian on 06.05.2015.
 */

bsSessionModule.factory('bsSession.bsSessionFactory', ['$frontendURL', 'bsMindmap.bsMapFactory', 'bsUtil.bsServerTime', '$timeout', function (baseURL, mapFactory, bsServerTime, timeout) {

    /**
     @class Session
     @type {Object}
     @property {function(): String} getID
     @property {function(): String} getTopic
     @property {function(): String} getDescription
     @property {function(): Date} getStartingTime
     @property {function(): Date} getEndTime
     @property {function(): String} getLink
     @property {function(): Boolean} isExpired
     @property {function(): Boolean} isActive
     */

    /**
     *
     * @param {Object} specs
     * @returns {Session}
     * @constructor
     */
    function SessionFactory(specs) {
        let id = specs._id;
        let topic = specs.topic;
        let description = specs.description;
        let startingTime = new Date(specs.startingTime);
        let duration = specs.duration;
        let endTime = new Date(startingTime.getTime() + duration);

        let isActive = false;
        let isExpired = false;

        let timeTillStart = startingTime.getTime() - bsServerTime.now();
        if (timeTillStart > 0) {
            timeout(() => {
                isActive = true;
                console.info("SESSION STARTED");
            }, timeTillStart);
        } else {
            isActive = true;
        }

        let timeTillEnd = endTime.getTime() - bsServerTime.now();
        if (timeTillEnd > 0) {
            timeout(() => {
                isActive = false;
                isExpired = true;
                console.info("SESSION IS OVER");
            }, timeTillEnd);
        } else {
            isActive = false;
            isExpired = true;
        }

        return {
            /**
             * get id of Session
             * @returns {String}
             */
            getID () {
                return id;
            },

            /**
             * get topic of Session
             * @returns {String}
             */
            getTopic() {
                return topic;
            },

            /**
             * get description of Session
             * @returns {String}
             */
            getDescription() {
                return description;
            },

            /**
             * get starting date of Session
             * @returns {Date}
             */
            getStartingTime() {
                return startingTime;
            },

            /**
             * get end date of Session
             * @returns {Date}
             */
            getEndTime() {
                return endTime;
            },

            /**
             * get link to a Session
             * @returns {String}
             */
            getLink() {
                return baseURL + '#/' + this.getID();
            },

            /**
             * is Session expired
             * @returns {Boolean}
             */
            isExpired() {
                return isExpired;
            },

            /**
             * is session still active
             * @returns {Boolean}
             */
            isActive() {
                return isActive;
            }
        }
    }

    return {
        /**
         * construct new Session Object
         * @param {Object} specs
         * @returns {Session}
         */
        construct : function(specs) {
            let map = mapFactory.construct(specs.map);
            let session = SessionFactory(specs);

            return Object.assign(Object.create(map), session);
        }
    }
}]);