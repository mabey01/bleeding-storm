/**
 * Created by Maximilian on 26.07.2015.
 */

bsEventsModule.factory('bsUtil.bsEvent', [function() {

    function tryCreatingEvent(...cbs) {
        return cbs.reduce((prev, cb) => {
            if (prev == null) {
                try {
                    return cb();
                } catch(e) {
                    return null;
                }
            }
            return prev;
        }, null)
    }

    return {
        construct(eventType, extendEvent = {}) {
            return tryCreatingEvent(
                () => {
                    return new MouseEvent(eventType, extendEvent);
                },
                () => {
                    let event = document.createEvent("Event");
                    event.initEvent(eventType, true, true);
                    return event;
                }
            );
        }
    }
}]);