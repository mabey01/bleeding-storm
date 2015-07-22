/**
 * Created by Maximilian on 19.05.2015.
 */

bsMindmapModule.factory('bsMindmap.bsMapNodeFactory', ['bsEvents.bsEventHandler', 'bsUtil.idGenerator', 'bsMindmap.bsPositionFactory', 'bsMindmap.ID_LENGTH', function (bsEventHandlerFactory, idGenerator, positionFactory, ID_LENGTH) {

    /**
     *
     * @param specs
     * @returns {*}
     * @constructor
     */
    function MapNodeFactory(specs = {}) {
        let id = null;
        if ('id' in specs) {
            id = specs.id;
        } else if ('parentID' in specs) {
            id = specs.parentID + idGenerator.createID(ID_LENGTH);
        }

        let title = specs.title || '';
        let children = [];
        if ('children' in specs) {
            children = specs.children.map((childSpecs) => {
                return MapNodeFactory(childSpecs);
            })
        }

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

        let bsEventHandler = bsEventHandlerFactory.construct();
        let newMapNode =  {
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
            setTitle(newTitle, fireUpdate = true) {
                title = newTitle;
                if (fireUpdate) this._trigger('updateNode', this);
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
                this._trigger('updateNode', this);
                return position;
            },
            getChildren() {
                return children;
            },

            isChild(child) {
                let id = child;
                if ('getID' in child) {
                    id = child.getID();
                }

                return children.reduce((prev, child) => {
                    if (prev) return prev;
                    return child.getID() === id;
                }, false)
            },
            addNode(nodeSpecs, fromExtern = false) {
                let newChild = null;
                if ("getID" in nodeSpecs && "getTitle" in nodeSpecs) {
                    newChild = nodeSpecs;
                } else {
                    nodeSpecs.parentID = this.getID();
                    newChild = MapNodeFactory(nodeSpecs);
                }

                children.push(newChild);
                this.bubbleEvents(newChild);

                this._trigger('newNode', newChild, fromExtern);
                return newChild;
            },
            isEditable() {
                return editable;
            },
            update(updateObject, fromExtern = false) {
                if ("title" in updateObject) {
                    this.setTitle(updateObject.title, false);
                }

                if("position" in updateObject) {
                    this.getPosition().setPosition(updateObject.position);
                }

                this._trigger('updateNode', this, fromExtern);
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
        };

        let newObj =  Object.assign(Object.create(bsEventHandler), newMapNode);
        newObj.getChildren().forEach((child) => {
            newObj.bubbleEvents(child);
        })

        return newObj;
    }

    return {
        construct : MapNodeFactory
    };
}]);