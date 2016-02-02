/**
 * Created by Maximilian on 02.07.2015.
 */

bsMindmapModule.factory('bsMindmap.bsPositionFactory', [function() {

    /**
     @class bsPosition
     @type {Object}
     @property {function(): Number} getX
     @property {function(): Number} getY
     @property {function(): String} toString
     @property {function(Number|bsPosition, Number=)} setPosition
     @property {function(): {x: Number, y: Number}} getPosition
     @property {function(Number|bsPosition, Number=)} moveBy
     @property {function(Number|bsPosition, Number=): String} subtract
     @property {function(bsPosition): Boolean} equals
     @property {function(): {x: Number, y: Number}} serialize
     */

    /**
     *
     * @param {Object} specs
     * @returns {bsPosition}
     * @constructor
     */
    let PositionFactory = function PositionFactory(specs) {
        let x = specs.x || 0;
        let y = specs.y || 0;

        return {
            /**
             * get x coodinate
             * @returns {Number}
             */
            getX() {
                return x;
            },

            /**
             * get y coodinate
             * @returns {Number}
             */
            getY() {
                return y;
            },

            /**
             * get string representation
             * @returns {String}
             */
            toString() {
                return `X: ${x}, Y: ${y}`
            },

            /**
             * set postion to new Position
             * @param {Number|bsPosition} newPosition
             * @param {Number=} newY
             */
            setPosition(newPosition, newY= 0) {
                let newX = newPosition;

                if (newPosition.hasOwnProperty('x')) {
                    newX = newPosition.x;
                } else if(newPosition.hasOwnProperty('getX')) {
                    newX = newPosition.getX();
                }

                if (newPosition.hasOwnProperty('y')) {
                    newY = newPosition.y;
                } else if(newPosition.hasOwnProperty('getY')) {
                    newY = newPosition.getY();
                }

                x = newX;
                y = newY;
            },

            /**
             * get simple position object
             * @returns {{x: Number, y: Number}
             */
            getPosition() {
                return {
                    x: this.getX(),
                    y: this.getY()
                }
            },

            /**
             * move position by Position or coordinates
             * @param {Number|bsPosition} deltaPosition
             * @param {Number=} deltaY
             * @returns {bsPosition}
             */
            moveBy(deltaPosition, deltaY = 0) {
                let deltaX = deltaPosition;

                if(deltaPosition.hasOwnProperty('getX')) {
                    deltaX = deltaPosition.getX();
                }

                if (deltaPosition.hasOwnProperty('getY')) {
                    deltaY = deltaPosition.getY();
                }

                let newX = this.getX() + parseInt(deltaX);
                let newY = this.getY() + parseInt(deltaY);

                return PositionFactory({
                    x : newX,
                    y : newY
                });
            },

            /**
             * subtract position by Position or coordinates
             * @param {Number|bsPosition} position
             * @param {Number=} deltaY
             * @returns {bsPosition}
             */
            subtract(position, deltaY = 0) {
                let deltaX = position;

                if(position.hasOwnProperty('getX')) {
                    deltaX = position.getX();
                }

                if (position.hasOwnProperty('getY')) {
                    deltaY = position.getY();
                }

                let newX = this.getX() - parseInt(deltaX);
                let newY = this.getY() - parseInt(deltaY);

                return PositionFactory({
                    x : newX,
                    y : newY
                });
            },

            /**
             * is same position
             * @param {Number|bsPosition} position
             * @param {Number=} posY
             * @returns {Boolean}
             */
            equals(position, posY = 0) {
                let posX = position;

                if(position.hasOwnProperty('getX')) {
                    posX = position.getX();
                }

                if (position.hasOwnProperty('getY')) {
                    posY = position.getY();
                }

                return posX == this.getX() && posY == this.getY();
            },

            /**
             * get serialied version of this Object
             * @returns {{x: Number, y: Number}}
             */
            serialize() {
                return {
                    x: this.getX(),
                    y: this.getY()
                }
            }
        }
    };

    return {
        /**
         * constuct a new bsPosition Object
         * @params {Object=} specs
         * @returns {bsPosition}
         */
        construct(specs = {}) {
            return PositionFactory(specs);
        }
    }
}]);