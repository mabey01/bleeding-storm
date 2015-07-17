/**
 * Created by Maximilian on 19.05.2015.
 */

bsMindmapModule.directive('bsMap', ['$compile', 'bsMindmap.MAP_DIMENSIONS', 'bsMindmap.ID_LENGTH', function (compile, MAP_DIMENSIONS, ID_LENGTH) {

    function logMap(root) {
        console.log("Node Title: ", root.getTitle());
        console.log("Node ID: ", root.getID());
        console.log("Node Position: ", root.getPosition().toString());
        let children = root.getChildren();
        if (children.length > 0) {
            console.group("Node Children: ");
            children.forEach((child) => {
                logMap(child);
            });

            console.groupEnd();
        }
    }

    return {
        restrict : 'E',
        scope : {
            session : '=',
            isEditible : '@'
        },
        templateUrl : 'templates/mindmap/directives/bsMap.tpl.html',
        link (scope, element, attrs) {
            const session = scope.session;
            const map = element.find('section');

            const MAP_WIDTH = MAP_DIMENSIONS.width;
            const MAP_HEIGHT = MAP_DIMENSIONS.height;

            map.css({
                width: MAP_WIDTH + "px",
                height: MAP_HEIGHT + "px"
            });

            session.setupConnection().then(() => {
                let count = 1;
                session.on('numberOfUsers', (newCount) => {
                    count = newCount;
                });

                session.on('joinedUser', () => {
                    count++;
                    alert("Number of Users: " + count);
                });

                session.on('leftUser', () => {
                    count--;
                    alert("Number of Users: " + count);
                });

                session.on('newNode', (rawNodeSpecs) => {
                    session.insertRawNode(rawNodeSpecs);
                    renderNode(session.getRoot());
                });

                session.on('updateNode', (rawNodeSpecs) => {
                    let oldNode = session.getNodeByID(rawNodeSpecs.id);
                    oldNode.update(rawNodeSpecs);
                    renderNode(session.getRoot());
                    scope.$broadcast('update');
                })
            });


            let nodeCache = [];

            /**
             * render a mapNode by providing the node object
             * @param node
             */
            function renderNode(node) {
                function adjustPosition(position) {
                    let deltaX = parseInt(MAP_WIDTH / 2);
                    let deltaY = parseInt(MAP_HEIGHT / 2);
                    return position.moveBy(deltaX, deltaY);
                }

                function displayNode(node, position, adjustmentNedded = false) {
                    if (adjustmentNedded) position = adjustPosition(position);
                    node.addClass('hide node');
                    map.append(node);

                    node.css({
                        left : Math.round(position.getX()) + 'px',
                        top : Math.round(position.getY()) + 'px'
                    });

                    node.removeClass('hide');
                }
                nodeCache[node.getID()] = node.getCopy();
                let newNode = angular.element(`<bs-map-node class="${node.isEditable() ? 'editable bs-draggable' : 'nonEditable'}" node-id="${node.getID()}"></bs-map-node>`);
                displayNode(newNode, node.getPosition(), true);
                compile(newNode)(scope);
            }

            /**
             * render the whole map by providing the rootNode
             * @param node
             */
            function renderMap(node) {
                renderNode(node);
                node.getChildren().forEach((child) => renderMap(child));
            }

            attrs.$observe('isEditible', function(value, oldValue){

            });

            scope.getNodeByID = session.getNodeByID.bind(session);
            scope.$on('newMapNode', (event, newNode) => {
                session.emit("newNode", newNode.serialize());
                console.log("============= MAP ==============");
                logMap(session.getRoot());
                console.log("========= MAP END ==============");
                renderNode(session.getRoot());
            });

            scope.$on('updateNode', (event, updatedNode) => {
                session.emit("updateNode", updatedNode.serialize());
            });



            renderNode(session.getRoot());
        }
    }
}]);