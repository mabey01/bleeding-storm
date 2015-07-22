/**
 * Created by Maximilian on 02.07.2015.
 */

bsMindmapModule.factory('bsMindmap.bsPositionFactory', [function() {

    let PositionFactory = function PositionFactory(specs) {
        let x = specs.x || 0;
        let y = specs.y || 0;

        return {
            getX() {
                return x;
            },

            getY() {
                return y;
            },

            toString() {
                return `X: ${x}, Y: ${y}`
            },

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

            getPosition() {
                return {
                    x: this.getX(),
                    y: this.getY()
                }
            },

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

            serialize() {
                return {
                    x: this.getX(),
                    y: this.getY()
                }
            }
        }
    };

    return {
        construct(specs = {}) {
            return PositionFactory(specs);
        }
    }
}]);