/**
 * Created by Maximilian on 19.05.2015.
 */

bsMindmapModule.directive('bsDraggable', ['bsUtil.touchSupport', function (touchSupport) {
    return {
        restrict : 'AC',
        priority : 100,
        link : function (scope, element, attrs) {
            let dragCoordinates = null;
            let lastCoordinates = null;
            let dragTagret = element[0];
            let parent = dragTagret.parentElement;

            /**
             * reset all drag parameters
             */
            function reset() {
                lastCoordinates = null;
                dragCoordinates = {
                    x : 0,
                    y : 0
                };
            }

            /**
             *
             * @param newCoordinates
             * @returns {*}
             */
            function getNewDragCoordinates(newCoordinates) {
                if (lastCoordinates) {
                    let deltaX = newCoordinates.x - lastCoordinates.x;
                    let deltaY = newCoordinates.y - lastCoordinates.y;

                    dragCoordinates.x += deltaX;
                    dragCoordinates.y += deltaY;
                }

                lastCoordinates = newCoordinates;

                return dragCoordinates;
            }

            function getMovement(newCoordinates) {
                let moveX = 0;
                let moveY = 0;

                if (lastCoordinates) {
                    moveX = newCoordinates.x - lastCoordinates.x;
                    moveY = newCoordinates.y - lastCoordinates.y;
                }

                return {x : parseInt(moveX), y: parseInt(moveY)};
            }

            /**
             * trigger the start of a dragging motion
             * @param event
             */
            function triggerDragStart(event) {
                reset();
                document.body.style.cursor = 'move';

                let dragstartEvent = new MouseEvent("dragstart", event);
                dragTagret.dispatchEvent(dragstartEvent);
            }

            /**
             * trigger the drag event
             */
            function triggerDrag(event, screenCoordinates) {
                event.stopPropagation();

                let dragEvent = new MouseEvent("drag", event);

                console.log(screenCoordinates);
                dragEvent.movement = getMovement(screenCoordinates);
                console.log(dragEvent.movement);
                dragEvent.drag = getNewDragCoordinates(screenCoordinates);
                dragTagret.dispatchEvent(dragEvent);
            }

            /**
             * trigger the dragend event
             * @param event
             */
            function triggerDragEnd(event) {
                event.stopPropagation();

                document.body.style.cursor = 'auto';

                if (dragCoordinates) {
                    let dragendEvent = new MouseEvent("dragend", event);
                    dragendEvent.dragCoordinates = dragCoordinates;
                    dragTagret.dispatchEvent(dragendEvent);
                    dragCoordinates = null;
                }
            }


            //====================== HANDLE DRAG WITH MOUSE =============================
            function handleMousedown(event) {
                triggerDragStart(event);

                dragTagret.removeEventListener("mousedown", handleMousedown, false);
                parent.addEventListener("mousemove", handleMousemove, false);
                document.addEventListener("mouseup", handleMouseup, false);
            }

            function handleMousemove(event) {
                triggerDrag(event, {x: event.screenX, y: event.screenY});
            }

            function handleMouseup(event) {
                triggerDragEnd(event);

                dragTagret.addEventListener("mousedown", handleMousedown, false);
                parent.removeEventListener("mousemove", handleMousemove, false);
                document.removeEventListener("mouseup", handleMouseup, false);
            }

            function enableClickDragging() {
                dragTagret.addEventListener("mousedown", handleMousedown, false);
            }

            //====================== HANDLE DRAG WITH TOUCH =============================
            function handleTouchstart(event) {
                triggerDragStart(event);

                dragTagret.removeEventListener("touchstart", handleTouchstart, false);
                parent.addEventListener("touchmove", handleTouchmove, false);
                document.addEventListener("touchend", handleTouchend, false);
            }

            function handleTouchmove(event) {
                event.preventDefault();

                let touch = event.changedTouches[0];
                triggerDrag(event, {x: touch.screenX, y: touch.screenY});
            }

            function handleTouchend(event) {
                triggerDragEnd(event);

                dragTagret.addEventListener("touchstart", handleTouchstart, false);
                parent.removeEventListener("touchmove", handleTouchmove, false);
                document.removeEventListener("touchend", handleTouchend, false);
            }

            function enableTouchDragging() {
                dragTagret.addEventListener("touchstart", handleTouchstart, false);
            }

            //====================== ENABLE DRAG TECHNICHES =============================
            if (touchSupport.isTouchSupported()) {
                enableTouchDragging()
            } else {
                enableClickDragging();
            }
        }
    }
}]);