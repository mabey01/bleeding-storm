/**
 * Created by Maximilian on 06.05.2015.
 */

bsSessionModule.factory('bsSession.SessionFactory', ['$frontendURL', 'bsMindmap.MapFactory', 'bsSocket.bsSocket', function (baseURL, mapFactory, bsSockets) {

    /**
     *
     * @param specs
     * @returns {*}
     * @constructor
     */
    function SessionFactory(specs) {
        let ID = specs._id;
        let topic = specs._topic;
        let description = specs._description;
        let startingTime = new Date(specs._startingTime);
        let duration = specs._duration;
        let activeUsers = 1;

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

                    socket.on("joinedUser", () => { activeUsers++});
                    socket.on("leftUser", () => { activeUsers--});
                    socket.on("numberOfUsers", (numberOfUsers) => {activeUsers = numberOfUsers});
                    socket.on("newNode", (rawNodeSpecs) => {this.insertRawNode(rawNodeSpecs)});
                    socket.on("updateNode", (updatedNodeSpecs) => {this.updateRawNode(updatedNodeSpecs)});
                });
            },
            emit(eventName, data) {
                return bsSockets.getSocket().then((socket) => {
                    socket.emit(eventName, data);
                });
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