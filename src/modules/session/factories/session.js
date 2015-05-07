/**
 * Created by Maximilian on 06.05.2015.
 */

bsSessionModule.factory('bsSession.SessionFactory', ['$frontendURL', function (baseURL) {

    class Session {
        constructor(specs) {
            if ('_id' in specs) {
                this._id = specs._id;
            }

            if ('_topic' in specs) {
                this._topic = specs._topic;
            }

            if ('_timestamp' in specs) {
                this._time = new Date(specs._timestamp);

                this._active = true;
                var timeLeft = this._time.getTime() - Date.now();
                if (timeLeft > 0) {
                    this._active = false;
                    setTimeout(function() {
                        this._active = true;
                    }.bind(this), timeLeft)
                }
            }
        }

        getID() {
            return this._id;
        }

        getTopic() {
            return this._topic;
        }

        getTime() {
            return this._time;
        }

        getLink() {
            return baseURL + '#/' + this._id;
        }
    }

    return {
        construct : function(specs) {
            return new Session(specs);
        },

        constructed : function (object) {
            return object instanceof Session;
        }
    }
}]);