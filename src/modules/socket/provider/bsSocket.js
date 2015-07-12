/**
 * Created by Maximilian on 26.05.2015.
 */

bsModuleSocket.provider('bsSocket.bsSocket', [function () {

    let socket = null;
    function openSocket (backendURL) {
        socket = io(backendURL);
        return new Promise((resolve, reject) => {
            socket = io(backendURL);
            socket.on('connect', function(){
                resolve(socket);
            });
        });
    }

    function getSocket(backendURL) {
        if (socket) {
            return Promise.resolve(socket);
        } else {
            return openSocket(backendURL)
        }
    }

    function setSessionID(sessionID) {
        socket.emit("sessionID", sessionID);
    }

    function on(eventName, callback) {
        socket.on(eventName, callback);
    }

    this.$get = ['$backendURL', function (backendURL) {
        return {
            getSocket() {
                return getSocket(backendURL);
            },
            setSessionID : setSessionID,
            on: on
        };
    }];
}]);