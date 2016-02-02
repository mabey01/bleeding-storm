/**
 * Created by Maximilian on 02.07.2015.
 */

bsMindmapModule.factory('bsMindmap.bsVectorFactory', [function() {

    /**
     @class bsVector
     @type {Object}
     @property {function(): Number} getX
     @property {function(): Number} getY
     @property {function(): Number} getZ
     @property {function(): bsVector} getNormalizedVector
     @property {function(): Number} getLength
     @property {function(bsVector)} add
     @property {function(bsVector)} multiply
     @property {function(bsVector)} stretch
     @property {function(Number)} rotate
     @property {function(): String} toString
     */

    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @returns {bsVector}
     * @constructor
     */
    let VectorFactory = function Vector(x,y,z) {
        return {
            /**
             * get x value
             * @returns {Number}
             */
            getX() {
                return x;
            },

            /**
             * get y value
             * @returns {Number}
             */
            getY() {
                return y;
            },

            /**
             * get z value
             * @returns {Number}
             */
            getZ() {
                return z;
            },

            /**
             * get normalized vector
             * @returns {bsVector}
             */
            getNormalizedVector() {
                let length = this.getLength();
                let normalizedX = x / length;
                let normalizedY = y / length;
                let normalizedZ = z / length;
                return Vector(normalizedX, normalizedY, normalizedZ);
            },

            /**
             * get vector length
             * @returns {Number}
             */
            getLength() {
                return Math.sqrt((x*x) + (y*y) + (z*z));
            },

            /**
             * add another vector
             * @param {bsVector} vector
             */
            add(vector) {
                x += vector.getX();
                y += vector.getY();
                z += vector.getZ();
            },

            /**
             * multiply by another vector
             * @param {bsVector} vector
             */
            multiply(vector) {
                x *= vector.getX();
                y *= vector.getY();
                z *= vector.getZ();
            },

            /**
             * stretch by factor
             * @param {Number} factor
             */
            stretch(factor) {
                this.multiply(Vector(factor, factor, factor));
            },

            /**
             * rotate by angle
             * @param {Number} angle
             */
            rotate(angle) {
                const radiant = angle * Math.PI / 180;
                const cos = Math.cos(radiant);
                const sin = Math.sin(radiant);
                const oldX = x;
                const oldY = y;

                x = oldX * cos - oldY * sin;
                y = oldX * sin + oldY * cos;
            },

            /**
             * get string representation
             * @returns {String}
             */
            toString() {
                return `(X: ${this.getX()}, Y: ${this.getY()}, Z: ${this.getZ()})`
            }
        }
    };

    return {
        construct(x,y,z = 0) {
            return VectorFactory(x,y,z);
        }
    }
}]);