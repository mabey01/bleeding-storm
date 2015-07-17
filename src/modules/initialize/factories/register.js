/**
 * Created by Maximilian on 17.05.2015.
 */

moduleInitialize.factory('Initialize.register', [function () {

    /**
     * API:
     * name : {String} Name of the Register
     * parentRegister : {String} name of the parent register
     * bootstrapURL : {String} URL to get initialization data
     * restURL : {String} rest URL interface
     * dependencies : <Object> key:name, value: Service Name
     * constructObject : {Function} to construct an object from raw object
     *
     */
    let RegisterFactory = function RegisterFactory() {
        let registeredObjects = {};
        let networkRequests = {};

        return {
            bootstrap(){
                if (!this.ajax) return Promise.reject('ajax is not defined');
                let initURL = this.bootstrapURL;
                if (initURL[0] == '/' ) initURL = initURL.substr(1);

                return this.ajax.get({url: initURL}).then(
                    (rawObjects) => {
                        if (!angular.isFunction(this.constructObject)) return Promise.reject('constructObject function is not defined');

                        let objectConstructionPromises = rawObjects.map((rawObject) => {
                            return this.addRawObject(rawObject);
                        });

                        return Promise.all(objectConstructionPromises);
                    }
                );
            },

            terminate() {
                registeredObjects = {};
            },

            addObject(object) {
                if ('getID' in object) {
                    let objectID = object.getID();
                    registeredObjects[objectID] = object;
                    return object;
                }
                return false;
            },

            addObjects(objects) {
                if (angular.isArray(objects)) {
                    return objects.map((object) => {
                        return this.addObject(object)
                    });
                }
                return false;
            },

            addRawObject(rawObject) {
                let objectID = rawObject._id || rawObject.id;
                if (objectID in registeredObjects){
                    return Promise.resolve(registeredObjects[objectID]);
                }

                if (objectID in networkRequests) {
                    return Promise.resolve(networkRequests[objectID]);
                }

                return Promise.resolve(this.constructObject(rawObject)).then((newObject) => {
                    return this.addObject(newObject);
                });
            },

            addRawObjects(rawObjects) {
                if (angular.isArray(rawObjects)) {
                    return Promise.all(rawObjects.map((rawObject) => {
                        return this.addRawObject(rawObject);
                    }));
                }
                return false;
            },

            removeObjectByID(objectID) {
                if (objectID in registeredObjects) {
                    delete registeredObjects[objectID];
                    return true;
                }
                return false;
            },

            removeObjectsByID(objectIDs) {
                if (angular.isArray(objectIDs)) {
                    return objectIDs.map((objectID) => {
                        return this.removeObjectByID(objectID);
                    });
                }

                return false;
            },

            getObjectByID(objectID) {
                if (objectID in registeredObjects) {
                    return Promise.resolve(registeredObjects[objectID]);
                }
                if(objectID in networkRequests) {
                    return networkRequests[objectID];
                }

                let networkRequest = this.ajax.get({url : this.getRestURL('get') + '/' + objectID})
                    .then(this.constructObject.bind(this))
                    .then(this.addObject.bind(this))
                    .then((newObject) => {
                        let objectID = newObject.getID();
                        if (objectID in networkRequests) {
                            delete networkRequests[objectID];
                        }

                        return newObject;
                    });
                networkRequests[objectID] = networkRequest;
                return networkRequest;
            },

            getObjectsByID(objectIDs) {
                if (!angular.isArray(objectIDs)) return Promise.reject('provided parameter is not an array');

                let promiseArray = objectIDs.map((objectID) => {
                    return this.getObjectByID(objectID);
                });

                return Promise.all(promiseArray);
            },

            createNewObject(newObject) {
                return this.ajax.post({
                    url: this.getRestURL('post'),
                    data: newObject
                })
                    .then((rawObject) => {
                        return this.addRawObject(rawObject);
                    }
                );
            },

            getAll() {
                let searchArray = [];
                for(let id in registeredObjects) {
                    searchArray.push(registeredObjects[id]);
                }
                return searchArray;
            },

            map(searchFunction) {
                let searchArray = [];
                for(let id in registeredObjects) {
                    let object = registeredObjects[id];
                    if (searchFunction(object)) searchArray.push(object);
                }
                return searchArray;
            },

            getRestURL(method) {
                let adjustURL = (url) => {
                    if (url[0] === '/') url = url.substr(1);
                    return url;
                };

                if (this.restURL) {
                    if (angular.isString(this.restURL)) return adjustURL(this.restURL);
                    if (method in this.restURL) return adjustURL(this.restURL[method]);
                }
            }
        }
    };

    return {
        construct(spec = {}) {
            return Object.assign(RegisterFactory(), spec);
        }
    }
}]);
