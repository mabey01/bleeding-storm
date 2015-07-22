/**
 * Created by Maximilian on 18.07.2015.
 */

bsMindmapModule.factory("bsMindmap.bsMapSocketHandlerFactory", ['bsSocket.bsSocket', function(bsSockets) {

    /**
     *
     * @returns {*}
     * @constructor
     */
    function SocketHandlerFactory() {
        let activeUsers = 1;

        return {

        }
    }

    return {
        construct() {
            return SocketHandlerFactory();
        }
    }
}]);