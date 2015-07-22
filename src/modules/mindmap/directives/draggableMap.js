/**
 * Created by Maximilian on 19.05.2015.
 */

bsMindmapModule.directive('bsDraggableMap', ['bsMap.cssProperties', function (vendorPrefix) {
    return {
        restrict: 'AC',
        link : function(scope, element, attrs) {
            const map = element.children()[0];
            const cssTransform = vendorPrefix.getVendorProperty(element[0], 'transform');
            const boundingBox = map.getBoundingClientRect();
            const initTranslate = {
                x : ((boundingBox.width/2) * -1) + (window.innerWidth / 2),
                y : (boundingBox.height/2) * -1 + (window.innerHeight / 2)
            };

            let translate = {
                x : 0,
                y : 0
            };
            let scale = 1;
            let adjustLayer = function () {
                let x = parseInt(initTranslate.x + translate.x);
                let y = parseInt(initTranslate.y + translate.y);
                let realScale = Math.round(scale * 100) / 100;

                map.style[cssTransform] = `translate(${x}px,${y}px) scale(${realScale})`;
            };

            element.on('drag', (e) => {
                translate.x += e.movement.x;
                translate.y += e.movement.y;
                adjustLayer();
            });
            element.on('zoom', function (e) {
                scale = e.scale;
                adjustLayer();
            });

            adjustLayer();
        }
    }
}]);