/**
 * Created by Maximilian on 19.05.2015.
 */

bsMindmapModule.factory('bsMindmap.MapNodeFactory', ['bsUtil.idMaker', 'bsMap.Position', 'bsMindmap.ID_LENGTH', function (idMaker, positionFactory, ID_LENGTH) {

    let MapNodeFactory = function MapNodeFactory(specs) {
        let id = specs.parentID || '';
        id += specs.id || idMaker.createID(ID_LENGTH);

        let title = specs.title || '';
        let children = [];
        let position = null;

        if ('position' in specs) {
            let specPos = specs.position;
            if (specPos.hasOwnProperty('getX')) {
                position = specPos;
            } else {
                let x = specPos.x || 0;
                let y = specPos.y || 0;
                position = positionFactory.construct({x : x, y: y})
            }
        } else {
            position = positionFactory.construct({x : 0, y: 0})
        }

        let editable = specs.editable || false;

        return {
            getID() {
                return id;
            },

            getParentID() {
                if (id.length > ID_LENGTH) {
                    return id.substr(0, id.length - ID_LENGTH);
                }
                return null;
            },

            getTitle() {
                return title;
            },

            setTitle(newTitle) {
                title = newTitle;
            },

            getPosition() {
                return position;
            },

            setPosition(newPosition) {
                if ('x' in newPosition) {
                    position.x = newPosition.x;
                }

                if ('y' in newPosition) {
                    position.y = newPosition.y;
                }
            },

            moveBy(deltaPos, deltaY = 0) {
                let deltaX = deltaPos;

                if(deltaPos.hasOwnProperty('x')) {
                    deltaX = deltaPos.x;
                }

                if (deltaPos.hasOwnProperty('y')) {
                    deltaY = deltaPos.y;
                }

                position = position.moveBy(deltaX, deltaY);
            },

            getChildren() {
                return children;
            },

            addNode(nodeSpecs) {
                let newChild = null;
                if ("getID" in nodeSpecs && "getTitle" in nodeSpecs) {
                    newChild = nodeSpecs;
                } else {
                    nodeSpecs.parentID = this.getID();
                    newChild = MapNodeFactory(nodeSpecs);
                }

                children.push(newChild);
                return newChild;
            },

            isEditable() {
                return editable;
            },

            update(updateObject) {
                if ("title" in updateObject) {
                    this.setTitle(updateObject.title);
                }
            },

            serialize() {
                return {
                    title : this.getTitle(),
                    position : this.getPosition().serialize(),
                    id : this.getID()
                }
            },

            getCopy() {
                return MapNodeFactory(this.serialize())
            }
        }
    };

    return {
        construct(specs) {
            return MapNodeFactory(specs);
        }
    };
}]);