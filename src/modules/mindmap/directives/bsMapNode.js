/**
 * Created by Maximilian on 20.05.2015.
 */

bsMindmapModule.directive('bsMapNode', ['bsMindmap.bsVectorFactory', 'bsMap.cssProperties', 'bsMindmap.VECTOR_STRETCH_FACTOR', 'bsUtil.touchSupport', function (vectorFactory, vendorPrefix, STRETCH_FACTOR, bsTouchSupport) {
    return {
        restrict : 'E',
        transclude: true,
        template : '<div><ul class="addPoints"></ul><span class="content" ng-transclude></span></div>',
        link : function(scope, element, attrs) {
            const TRANSFORM_PROPERTY = vendorPrefix.getVendorProperty(element[0], 'transform');
            const points = [{x:0.5, y:0}, {x:1, y:0.5}, {x:0.5, y:1}, {x:0, y:0.5}];
            const svgNS = "http://www.w3.org/2000/svg";

            let node = null;
            let nodeID = null;
            let connectionsUpdates = [];

            if (attrs.nodeId) {
                nodeID = attrs.nodeId;
                if ('getNodeByID' in scope) {
                    node = scope.getNodeByID(nodeID);
                }
            }

            let content = element.find('span');
            let addPointList = element.find('ul');

            if (element.hasClass("nonEditable")) {
                node.on("updateNode", updateFromObject);
            } else {
                content[0].setAttribute('contenteditable', true);
                content[0].focus();

                content.on('keyup', setNewTitle);
                element.on('drag', setNewPosition);
            }

            if (bsTouchSupport.isTouchSupported()) {
                element.addClass('touch');
            }

            /**
             * update html representation from node object
             */
            function updateFromObject() {
                updateTitle(node.getTitle());

                let position = node.getPosition();
                updatePosition(position);
            }

            /**
             * update Title from MapNode Object
             */
            function updateTitle() {
                let oldTitle = content.html();
                let newTitle = node.getTitle();
                if (oldTitle != newTitle) {
                    content.html(newTitle);
                }
            }

            /**
             * update position
             * @param {bsPosition} position
             */
            function updatePosition(position) {
                connectionsUpdates.forEach((updateFN) => updateFN());
                element[0].style[TRANSFORM_PROPERTY] = `translate(-50%, -50%) translate3d(${position.getX()}px,${position.getY()}px,0)`;
            }

            /**
             * create a new child node
             * @param {Event} event
             */
            function createNewChild(event) {
                event.preventDefault();
                event.stopPropagation();

                let originalElement = event.srcElement || event.target || event.originalTarget;
                let position = parseInt(originalElement.getAttribute('data-position'));
                let vector = points[position].vector.getNormalizedVector();
                vector.stretch(STRETCH_FACTOR);

                let oldPosition = node.getPosition();
                let newPostion = oldPosition.moveBy(vector);

                let newChild = node.addNode({
                    position : newPostion,
                    editable : true
                });

                renderConnection(newChild);
            }

            /**
             * render points around the node
             * @param {Array} points
             */
            function renderPoints(points) {
                points.forEach((coordinates, position) => {
                    let point = angular.element("<li class='point'></li>");
                    coordinates.vector = vectorFactory.construct(coordinates.x - 0.5, coordinates.y - 0.5);

                    let right = 100 * coordinates.x;
                    point.css('left', parseInt(right) + "%");

                    let top = 100 * coordinates.y;
                    point.css('top', parseInt(top) + "%");

                    point.attr("data-position", position);
                    addPointList.append(point);
                });
            }

            /**
             * render a single connection to a child MapNode
             * @param {MapNode} child
             */
            function renderConnection(child) {
                let svg = document.createElementNS(svgNS,'svg');
                var arrowPath = document.createElementNS(svgNS,'path');

                let positionLine = function(child, parent) {
                    let childPos = child.getPosition();
                    let parentPos = parent.getPosition();

                    let newCoordinates = childPos.subtract(parentPos);

                    arrowPath.setAttribute('d', `M0,0 L${newCoordinates.getX()},${newCoordinates.getY()}`);
                };

                let updateConnection = positionLine.bind(null, child, node);
                child.on('updateNode', () => {
                    updateConnection();
                });

                connectionsUpdates.push(updateConnection);
                positionLine(child, node);
                svg.appendChild(arrowPath);

                element[0].appendChild(svg);
            }

            /**
             * set new title from keyup event
             * @param {Event} event
             */
            function setNewTitle(event) {
                let target = event.target;
                let newTitle = target.innerHTML;

                newTitle = newTitle.replace(/<br>/g, '\n');
                node.setTitle(newTitle);
            }

            /**
             * set new Position from drag event
             * @param {Event} event
             */
            function setNewPosition(event) {
                event.stopPropagation();
                let newPosition = node.moveBy(event.movement);
                updatePosition(newPosition);
            }

            addPointList.on("click", createNewChild);

            element.on('dblclick', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });

            scope.$on("$destroy", () => {
                content.unbind();
                element.unbind();
            });

            node.on("newNode", (newChild) => {
                if (node.isChild(newChild)) {
                    renderConnection(newChild)
                }
            });

            scope.$on("freeze", () => {
                element.addClass('freeze');
                addPointList.unbind();
                content.unbind();
                content[0].removeAttribute('contenteditable');
                element.unbind();
            });

            renderPoints(points);
            updateFromObject();
            node.getChildren().forEach(renderConnection);
        }
    }
}]);