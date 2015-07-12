/**
 * Created by Maximilian on 06.05.2015.
 */

bsSessionModule.factory('bsSession.SessionFactory', ['$frontendURL', 'bsMindmap.MapFactory', 'bsSocket.bsSocket', function (baseURL, mapFactory, bsSockets) {

    let SessionFactory = function (specs) {

        let ID = specs._id;
        let topic = specs._topic;
        let description = specs._description;
        let startingTime = new Date(specs._startingTime);
        let duration = specs._duration;
        let eventHandler = {};
        let triggerEvent = (eventName, data) => {
            if (eventName in eventHandler) {
                eventHandler[eventName].forEach((handler) => {
                    handler(data);
                })
            }
        };

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
                return this.endTime;
            },

            getLink() {
                return baseURL + '#/' + this.getID();
            },

            isExpired() {
                let now = Date.now();
                let isAfterStartingTime = now - startingTime.getTime() >= 0;
                return isAfterStartingTime;
            },

            isActive() {
                let now = Date.now();
                let isAfterStartingTime = now - startingTime.getTime() >= 0;
                let isBeforeEndTime = startingTime.getTime() - now > 0;
                return isAfterStartingTime;
            },

            setupConnection() {
                return bsSockets.getSocket().then((socket) => {
                    socket.emit("sessionID", this.getID());

                    socket.on("joinedUser", triggerEvent.bind(null, "joinedUser"));
                    socket.on("leftUser", triggerEvent.bind(null, "leftUser"));
                    socket.on("numberOfUsers", triggerEvent.bind(null, "numberOfUsers"));
                    socket.on("newNode", triggerEvent.bind(null, "newNode"));
                    socket.on("updateNode", triggerEvent.bind(null, "updateNode"));
                });
            },

            emit(eventName, data) {
                return bsSockets.getSocket().then((socket) => {
                    socket.emit(eventName, data);
                });
            },

            on(eventName, callback) {
                if (eventName in eventHandler) {
                    eventHandler[eventName].push(callback);
                } else {
                    eventHandler[eventName] = [callback];
                }
            }
        }
    };

    return {
        construct : function(specs) {
            console.log(specs);
            let map = mapFactory.construct(specs.map);
            let session = SessionFactory(specs);

            return Object.assign(Object.create(map), session);
        },

        constructed : function (object) {
            return object instanceof SessionFactory;
        }
    }
}]);