/**
 * Created by Maximilian on 06.05.2015.
 */

bsSessionModule.factory('bsSession.bsSessionFactory', ['$frontendURL', 'bsMindmap.bsMapFactory', 'bsMindmap.bsMapSocketHandlerFactory', '$timeout', function (baseURL, mapFactory, mapSocketHandlerFactory, timeout) {

    /**
     *
     * @param specs
     * @returns {*}
     * @constructor
     */
    function SessionFactory(specs) {
        let ID = specs._id;
        let topic = specs.topic;
        let description = specs.description;
        let startingTime = new Date(specs.startingTime);
        let duration = specs.duration;
        let endTime = new Date(startingTime.getTime() + duration);

        let isActive = false;
        let isExpired = false;

        let timeTillStart = startingTime.getTime() - Date.now();
        if (timeTillStart > 0) {
            timeout(() => {
                isActive = true;
                alert("SESSION STARTED");
            }, timeTillStart);
        } else {
            isActive = true;
        }

        let timeTillEnd = endTime.getTime() - Date.now();
        if (timeTillEnd > 0) {
            timeout(() => {
                isActive = false;
                isExpired = true;
                alert("SESSION IS OVER");
            }, timeTillEnd);
        } else {
            isActive = false;
            isExpired = true;
        }

        return {
            getID () {
                return ID;
            },
            getTopic() {
                return topic;
            },
            getDescription() {
                return description;
            },
            getStartingTime() {
                return startingTime;
            },
            getEndTime() {
                return endTime;
            },
            getLink() {
                return baseURL + '#/' + this.getID();
            },
            isExpired() {
                return isExpired;
            },
            isActive() {
                return isActive;
            }
        }
    }

    return {
        construct : function(specs) {
            let map = mapFactory.construct(specs.map);
            let session = SessionFactory(specs);

            return Object.assign(Object.create(map), session);
        },

        constructed : function (object) {
            return object instanceof SessionFactory;
        }
    }
}]);