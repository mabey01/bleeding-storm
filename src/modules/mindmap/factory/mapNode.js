/**
 * Created by Maximilian on 19.05.2015.
 */

bsMindmapModule.factory('bsMindmap.bsMapNodeFactory', ['bsEvents.bsEventHandler', 'bsUtil.idGenerator', 'bsMindmap.bsPositionFactory', 'bsMindmap.ID_LENGTH', function (bsEventHandlerFactory, idGenerator, positionFactory, ID_LENGTH) {

    /**
     @class MapNode
     @type {Object}
     @property {function(): String} getID
     @property {function(): String} getParentID
     @property {function(): String} getTitle
     @property {function(String)} setTitle
     @property {function(): bsPosition} getPosition
     @property {function({x: Number, y: Number})} setPosition
     @property {function(Number|Object, Number=)} moveBy
     @property {function(): Array.<MapNode>} getChildren
     @property {function(MapNode): Boolean} isChild
     @property {function(Object, Boolean=): MapNode} addNode
     @property {function(): Boolean} isEditable
     @property {function(Object, Boolean=)} update
     @property {function(): Object} serialize
     @property {function(): MapNode} getCopy
     */

    /**
     *
     * @param {Object} specs
     * @returns {MapNode}
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
            /**
             * get id of MapNode
             * @returns {String}
             */
            getID() {
                return id;
            },

            /**
             * get id of parent MapNode
             * @returns {String}
             */
            getParentID() {
                if (id.length > ID_LENGTH) {
                    return id.substr(0, id.length - ID_LENGTH);
                }
                return null;
            },

            /**
             * get title of MapNode
             * @returns {String}
             */
            getTitle() {
                return title;
            },

            /**
             * set new title of MapNode
             * @param {String} newTitle
             * @param {Boolean=} fireUpdate
             */
            setTitle(newTitle, fireUpdate = true) {
                title = newTitle;
                if (fireUpdate) this._trigger('updateNode', this);
            },

            /**
             * get Position of MapNode
             * @returns {bsPosition}
             */
            getPosition() {
                return position;
            },

            /**
             * set new position of MapNode
             * @param {{x: Number, y: Number}} newPosition
             */
            setPosition(newPosition) {
                if ('x' in newPosition) {
                    position.x = newPosition.x;
                }

                if ('y' in newPosition) {
                    position.y = newPosition.y;
                }
            },

            /**
             * move MapNode position by position or coordinates
             * * @param {{x: Number, y: Number}} deltaPos
             * * @param {Number=} deltaY
             */
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

            /**
             * get all children of MapNode Obejct
             * @returns {Array.<MapNode>}
             */
            getChildren() {
                return children;
            },

            /**
             * is MapNode a child of this MapNode
             * @param {MapNode} child
             * @returns {Boolean}
             */
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

            /**
             * add new Node to children
             * @param {Object} nodeSpecs
             * @param {Boolean=} fromExtern
             * @returns {MapNode}
             */
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

            /**
             * is MapNode editable
             * @returns {Boolean}
             */
            isEditable() {
                return editable;
            },

            /**
             * update MapNode with raw MapNode Object
             * @param {Object} updateObject
             * @param {Boolean} fromExtern
             */
            update(updateObject, fromExtern = false) {
                if ("title" in updateObject) {
                    this.setTitle(updateObject.title, false);
                }

                if("position" in updateObject) {
                    this.getPosition().setPosition(updateObject.position);
                }

                this._trigger('updateNode', this, fromExtern);
            },

            /**
             * get serialized version of this MapNode
             * @returns {{title: String, positio: Object, id: String}}
             */
            serialize() {
                return {
                    title : this.getTitle(),
                    position : this.getPosition().serialize(),
                    id : this.getID()
                }
            },

            /**
             * get exact copy of this object
             * @returns {MapNode}
             */
            getCopy() {
                return MapNodeFactory(this.serialize())
            }
        };

        let newObj =  Object.assign(Object.create(bsEventHandler), newMapNode);
        newObj.getChildren().forEach((child) => {
            newObj.bubbleEvents(child);
        });

        return newObj;
    }

    return {
        construct : MapNodeFactory
    };
}]);