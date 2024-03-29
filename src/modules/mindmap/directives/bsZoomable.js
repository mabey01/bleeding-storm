/**
 * Created by Maximilian on 20.05.2015.
 */

bsMindmapModule.directive('bsZoomable', ['bsUtil.bsEvent', function (bsEventFactory) {
    return {
        restrict : 'AC',
        priority : 100,
        link : function (scope, element, attrs) {

            let factor = 0.1;
            let scale = 1;

            element.on('mousewheel DOMMouseScroll', function (e) {
                let direction = e.wheelDeltaY || e.wheelDelta || (e.detail * -1);

                if (direction > 0) {
                    scale *= (factor + 1);
                } else if (direction < 0){
                    scale *= (1 - factor);
                }

                if (scale <= 0) scale = 0.01;
                let newZoomEvent = bsEventFactory.construct('zoom', e);
                newZoomEvent.scale = scale;

                this.dispatchEvent(newZoomEvent);
            })
        }
    }
}]);