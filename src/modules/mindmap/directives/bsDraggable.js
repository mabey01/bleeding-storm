/**
 * Created by Maximilian on 19.05.2015.
 */

bsMindmapModule.directive('bsDraggable', ['bsUtil.touchSupport', 'bsUtil.bsEvent', function (touchSupport, bsEventFactory) {
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
             * get delta coordinates from last dragstart
             * @param {{x: Number, y: Number}} newCoordinates
             * @returns {{x: Number, y: Number}}
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

            /**
             * get delta movement from last drag
             * @param newCoordinates
             * @returns {{x: Number, y: Number}}
             */
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
             * @param {Event} event
             */
            function triggerDragStart(event) {
                reset();
                document.body.style.cursor = 'move';
                let dragstartEvent = bsEventFactory.construct("dragstart", event);

                dragTagret.dispatchEvent(dragstartEvent);
            }

            /**
             * trigger the drag event
             * @param {Event} event
             * @param {{x: Number, y: Number}} screenCoordinates
             */
            function triggerDrag(event, screenCoordinates) {
                event.stopPropagation();

                let dragEvent = bsEventFactory.construct("drag", event);

                dragEvent.movement = getMovement(screenCoordinates);
                dragEvent.drag = getNewDragCoordinates(screenCoordinates);
                dragTagret.dispatchEvent(dragEvent);
            }

            /**
             * trigger the dragend event
             * @param {Event} event
             */
            function triggerDragEnd(event) {
                event.stopPropagation();

                document.body.style.cursor = 'auto';

                if (dragCoordinates) {
                    let dragendEvent = bsEventFactory.construct("dragend", event);;
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