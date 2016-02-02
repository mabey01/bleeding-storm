/**
 * Created by Maximilian on 12.05.2015.
 */

bsImagesModule.directive('bsBackgroundImage', ["bsImages.FullBackgroundImages", function(fullBackgroundImages) {

    /**
     * load an Array of images
     * @param {Array.<String>} images
     * @param {String=} dir
     * @returns {Promise}
     */
    var loadImages = function(images, dir = '/') {
        return new Promise((resolve, reject) => {
            let loadedImages = [];
            let finalLenght = images.length;
            let onLoad = (image) => {
                loadedImages.push(image);
                if (loadedImages.length === finalLenght) resolve(loadedImages);
            };

            let onError = (image) => {
                finalLenght--;
                if (loadedImages.length === finalLenght) resolve(loadedImages);
            };

            images.forEach((imageString) => {
                let newImage = new Image();
                newImage.onload = () => onLoad(newImage);
                newImage.onerror = () => onError(newImage);
                newImage.src = dir + imageString;
            })
        })
    };

    return {
        restrict : 'A',
        link : function(scope, element, attrs) {
            const INTERVAL_TIME = 10000;
            let imagesDir = 'images/';
            let loadedImages = [];
            let rotatingInterval = null;
            let index = -1;

            let imageContainer = angular.element('<div class="bsBackroundImage"></div>');
            element.prepend(imageContainer);

            let showNextImage = function() {
                try {
                    loadedImages[index].className = 'hidden';
                } catch(e) {}

                if (index + 1 >= loadedImages.length) index = 0; else index++;
                loadedImages[index].className = 'visible';
            };

            let rotateImages = () => {
                rotatingInterval = setInterval(showNextImage, INTERVAL_TIME);
            };

            var keydown = false;
            element.on("keydown", function (event) {
                if (event.keyCode === 39 && event.shiftKey) keydown = true;
            });

            element.on("keyup", function (event) {
                if (keydown) {
                    clearInterval(rotatingInterval);
                    showNextImage();
                    //rotateImages();
                    keydown = false;
                }
            });


            let startingTime = Date.now();
            loadImages(fullBackgroundImages, imagesDir).then(
                function(_loadedImages) {
                    loadedImages = _loadedImages;
                    loadedImages.forEach((image) => {
                        image.className = 'hidden';
                        imageContainer.append(image);
                    });

                    if ((Date.now() - startingTime) > 60*1000) {
                        showNextImage();
                    }
                    rotateImages();
                }
            );
        }
    }
}]);