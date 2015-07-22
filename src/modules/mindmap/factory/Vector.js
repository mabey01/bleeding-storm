/**
 * Created by Maximilian on 02.07.2015.
 */

bsMindmapModule.factory('bsMindmap.bsVectorFactory', [function() {

    let VectorFactory = function Vector(x,y,z) {
        return {
            getX() {
                return x;
            },

            getY() {
                return y;
            },

            getZ() {
                return z;
            },

            getNormalizedVector() {
                let length = this.getLength();
                let normalizedX = x / length;
                let normalizedY = y / length;
                let normalizedZ = z / length;
                return Vector(normalizedX, normalizedY, normalizedZ);
            },

            getLength() {
                return Math.sqrt((x*x) + (y*y) + (z*z));
            },

            add(vector) {
                x += vector.getX();
                y += vector.getY();
                z += vector.getZ();
            },

            multiply(vector) {
                x *= vector.getX();
                y *= vector.getY();
                z *= vector.getZ();
            },

            stretch(factor) {
                this.multiply(Vector(factor, factor, factor));
            },

            rotate(angle) {
                const radiant = angle * Math.PI / 180;
                const cos = Math.cos(radiant);
                const sin = Math.sin(radiant);
                const oldX = x;
                const oldY = y;

                x = oldX * cos - oldY * sin;
                y = oldX * sin + oldY * cos;
            },

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