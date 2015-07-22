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
            session : '='
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

            let nodeCache = [];

            /**
             * render a mapNode by providing the node object
             * @param node
             */
            function renderNode(node) {
                function displayNode(node) {
                    node.addClass('hide');
                    map.append(node);

                    node.css({
                        left : parseInt(MAP_WIDTH / 2) + 'px',
                        top : parseInt(MAP_HEIGHT / 2) + 'px'
                    });

                    node.removeClass('hide');
                }
                nodeCache[node.getID()] = node.getCopy();
                let newNode = angular.element(`<bs-map-node class="node ${node.isEditable() ? 'editable bs-draggable' : 'nonEditable'}" node-id="${node.getID()}"></bs-map-node>`);
                displayNode(newNode);
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

            scope.getNodeByID = session.getNodeByID.bind(session);

            session.startActiveSession();
            session.on("newNode", (newNode) => {
                console.log(newNode);
                renderNode(newNode);
            });

            if (attrs.isEditible === 'false') scope.$emit("mapNonEditable");
            attrs.$observe('isEditible', (newVal, oldValue) => {
                if (newVal === "false") scope.$emit("mapNonEditable");
            });

            renderMap(session.getRoot());
        }
    }
}]);