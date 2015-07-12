/**
 * Created by Maximilian on 20.05.2015.
 */

bsMindmapModule.directive('bsMapNode', ['bsMap.Vector', 'bsMap.cssProperties', 'bsMindmap.VECTOR_STRETCH_FACTOR', function (vectorFactory, vendorPrefix, STRETCH_FACTOR) {
    return {
        restrict : 'E',
        transclude: true,
        template : '<div><ul class="addPoints"></ul><span class="content" ng-transclude></span></div>',
        link : function(scope, element, attrs) {
            const TRANSFORM_PROPERTY = vendorPrefix.getVendorProperty(element[0], 'transform');

            let node = null;
            let nodeID = null;
            if (attrs.nodeId) {
                nodeID = attrs.nodeId;
                if ('getNodeByID' in scope) {
                    node = scope.getNodeByID(nodeID);
                }
            }

            let content = element.find('span');
            let addPointList = element.find('ul');
            let points = [{x:0.5, y:0}, {x:1, y:0.5}, {x:0.5, y:1}, {x:0, y:0.5}];
            let dragPosition = {
                x: 0,
                y: 0
            };

            content.html(node.getTitle());
            if (!element.hasClass("nonEditable")) {
                content[0].setAttribute('contenteditable', true);
                content[0].focus();
            }

            let setPoints = function() {
                let boundingBox = element[0].getBoundingClientRect();
                let height = boundingBox.height;
                let width = boundingBox.width;

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
            };

            setPoints();
            addPointList.on("click", function (event) {
                var originalElement = event.srcElement || event.target || event.originalTarget;
                var position = parseInt(originalElement.getAttribute('data-position'));
                let vector = points[position].vector.getNormalizedVector();
                vector.stretch(STRETCH_FACTOR);

                let oldPosition = node.getPosition();
                let newPostion = oldPosition.moveBy(vector.getX(), vector.getY());

                console.log(oldPosition.toString(), newPostion.toString());
                let newNode = node.addNode({
                    position : newPostion,
                    editable : true
                });

                scope.$emit('newMapNode', newNode);
            });

            content.on('keyup', (event) => {
                let newTitle = event.target.innerText;
                node.setTitle(newTitle);
                scope.$emit('updateNode', node);
            });

            element.on('dblclick', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });

            element.on('drag', (event) => {
                event.stopPropagation();

                node.moveBy(event.movement);
                dragPosition.x += event.movement.x;
                dragPosition.y += event.movement.y;
                element[0].style[TRANSFORM_PROPERTY] = `translate(-50%, -50%) translate(${dragPosition.x}px,${dragPosition.y}px)`;
            });

            element.on('dragend', (event) => {
                scope.$emit('updateNode', node);
            });

            scope.$on("update", (event) => {
                let oldTitle = content.html();
                let newTitle = node.getTitle();
                if (oldTitle != newTitle) {
                    content.html(newTitle);
                }
            });

            scope.$on("$destroy", () => {
                content.unbind();
                element.unbind();
            });
        }
    }
}]);