/**
 * Created by Maximilian on 19.05.2015.
 */

bsMindmapModule.factory('bsMindmap.bsMapFactory', ['bsMindmap.bsMapNodeFactory', 'bsEvents.bsEventHandler', 'bsSocket.bsSocket', 'bsMindmap.ID_LENGTH', function (mindmapNodeFactory, eventHandlerFactory, bsSockets, ID_LENGTH) {

    /**
     @class Map
     @type {Object}
     @property {function(): MapNode} getRoot
     @property {function(String): MapNode} getNodeByID
     @property {function(Object)} insertRawNode
     @property {function(Object)} updateRawNode
     @property {function()} startActiveSession
     @property {function()} suspendSession
     @property {function(): Number} getActiveUser
     */

    /**
     *
     * @param {Object=} specs
     * @returns {Map}
     * @constructor
     */
    function MapFactory(specs = {}) {
        let root = mindmapNodeFactory.construct(specs);
        let activeUsers = 1;

        let bsEventHandler = eventHandlerFactory.construct();
        let newMap = {
            /**
             * get root MapNode of Map
             * @returns {MapNode}
             */
            getRoot() {
                return root
            },

            /**
             * get MapNode by id
             * @param {String} id
             * @param {MapNode=} node
             * @return {MapNode}
             */
            getNodeByID(id, node = this.getRoot()) {
                let parentID = null;
                let childID = null;

                if (id.length > ID_LENGTH) {
                    parentID = id.substr(0,ID_LENGTH);
                    childID = id.substr(ID_LENGTH);
                } else {
                    childID = id;
                }

                let nodeID = node.getID();
                nodeID = nodeID.substr(nodeID.length - ID_LENGTH);

                if (childID == nodeID) return node;
                else if(nodeID == parentID) {
                    return node.getChildren().reduce((nodeFound, currentNode) => {
                        if (nodeFound == null) {
                            return this.getNodeByID(childID, currentNode);
                        } else {
                            return nodeFound;
                        }
                    }, null)
                }
            },

            /**
             * insert a new MapNode
             * @param {Object} rawNodeSpecs
             * @param {Boolean=} external
             */
            insertRawNode(rawNodeSpecs, external = false) {
                let id = rawNodeSpecs.id;
                let parentID = id.substr(0,id.length - ID_LENGTH);
                let parent = this.getNodeByID(parentID);

                parent.addNode(rawNodeSpecs, external);
            },

            /**
             * update an existing MapNode
             * @param {Object} rawNodeSpecs
             * @param {Boolean=} external
             */
            updateRawNode(rawNodeSpecs, external = false) {
                let id = rawNodeSpecs.id;
                let updateNode = this.getNodeByID(id);
                updateNode.update(rawNodeSpecs, external);
            },

            /**
             * start participating in Session
             */
            startActiveSession() {
                return bsSockets.getSocket().then((socket) => {
                    socket.emit("sessionID", this.getID());

                    socket.on("joinedUser", () => {
                        activeUsers++;
                        console.log("new User: ", activeUsers);
                        this._trigger('updateUser', activeUsers);
                    });
                    socket.on("leftUser", () => {
                        activeUsers--;
                        this._trigger('updateUser', activeUsers);
                    });
                    socket.on("numberOfUsers", (numberOfUsers) => {
                        activeUsers = numberOfUsers;
                        this._trigger('updateUser', activeUsers);
                    });
                    socket.on("newNode", (rawNodeSpecs) => this.insertRawNode(rawNodeSpecs, true));
                    socket.on("updateNode", (updatedNodeSpecs) => this.updateRawNode(updatedNodeSpecs, true));

                    this.on('newNode', (newNode, external) => {
                        if (!external) socket.emit('newNode', newNode.serialize())
                    });
                    this.on('updateNode', (newNode, external) => {
                        if (!external) socket.emit('updateNode', newNode.serialize())
                    });
                });
            },

            /**
             * stop participating in Session
             */
            suspendSession() {
                bsSockets.closeSocket();
            },

            /**
             * get number of active users
             * @returns {Number}
             */
            getActiveUser() {
                return activeUsers;
            }
        };
        newMap = Object.assign(Object.create(bsEventHandler), newMap);
        newMap.bubbleEvents(root);
        return newMap;
    }

    return {
        construct: MapFactory
    }
}]);