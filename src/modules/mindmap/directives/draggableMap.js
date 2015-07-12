/**
 * Created by Maximilian on 19.05.2015.
 */

bsMindmapModule.directive('bsDraggableMap', ['bsMap.cssProperties', function (vendorPrefix) {
    return {
        restrict: 'AC',
        link : function(scope, element, attrs) {
            const map = element.children()[0];

            const cssTransform = vendorPrefix.getVendorProperty(element[0], 'transform');
            let boundingBox = map.getBoundingClientRect();
            let initTranslate = {
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

                let newStyle = `translate(${x}px,${y}px) scale(${realScale})`;
                map.style[cssTransform] = newStyle;
            };

            element.on('drag', (e) => {
                translate.x += e.movement.x;
                translate.y += e.movement.y;
                console.log(translate);
                adjustLayer();
            });

            element.on('zoom', function (e) {
                console.log(e);
                scale = e.scale;
                adjustLayer();
            });

            adjustLayer();
        }
    }
}]);