/**
 * Created by Maximilian on 25.07.2015.
 */

bsModuleSocket.service('bsSocket.bsSocket', ['$backendURL', function (backendURL) {

    let socket = null;
    return {
        getSocket(url = backendURL) {
            if (socket) {
                return Promise.resolve(socket);
            } else {
                return this.openSocket(url)
            }
        },

        setSessionID(sessionID) {
            socket.emit("sessionID", sessionID);
        },

        openSocket (url) {
            return new Promise((resolve, reject) => {
                socket = io(url);
                socket.on('connect', () => {
                    resolve(socket);
                });

                socket.on('connect_error', reject);
            });
        },

        closeSocket() {
            socket.disconnect();
            socket = null;
        },

        on(eventName, callback) {
            socket.on(eventName, callback);
        }
    };
}]);