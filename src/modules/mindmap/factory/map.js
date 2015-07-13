/**
 * Created by Maximilian on 19.05.2015.
 */

bsMindmapModule.factory('bsMindmap.MapFactory', ['bsMindmap.MapNodeFactory', 'bsMindmap.ID_LENGTH', function (mindmapNodeFactory, ID_LENGTH) {

    let MapFactory = function (specs) {
        console.log(specs);
        let root = mindmapNodeFactory.construct(specs);

        return {
            getRoot() {
                return root
            },

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

            insertRawNode(rawNodeSpecs) {
                let newNode = mindmapNodeFactory.construct(rawNodeSpecs);
                let parent = this.getNodeByID(newNode.getParentID());
                parent.addNode(newNode);
            },

            updateRawNode(updatedNodeSpecs) {
                let oldNode = this.getNodeByID(updatedNodeSpecs.id);
                oldNode.update(updatedNodeSpecs);
            }
        }
    };

    return {
        construct(specs) {
            return MapFactory(specs);
        }
    }
}]);