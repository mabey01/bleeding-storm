/**
 * Created by Maximilian on 06.05.2015.
 */

bsUtilModule.directive('bsCountdown', ['$translate', 'bsUtil.bsServerTime', function (translate, bsServerTime) {

    /**
     * parse timestamp form string
     * @param {String} timeString
     * @returns {Number}
     */
    function parseTime(timeString) {
        let time = Date.parse(timeString);

        if (time.prototype != 'Date') {
            time = new Date(timeString);
        }

        if (time.prototype != 'Date') {
            time = new Date(parseInt(timeString));
        }

        return time;
    }

    /**
     * format timestamp to string
     * @param {Number} time
     * @returns {string}
     */
    function formatTime(time) {
        let helpTime = time;

        let days = parseInt(helpTime / (24*60*60*1000));
        helpTime -= days * (24*60*60*1000);

        let hours = parseInt(helpTime / (60*60*1000));
        helpTime -= hours * (60*60*1000);

        let minutes = parseInt(helpTime / (60*1000));
        helpTime -= minutes * (60*1000);

        let seconds = parseInt(helpTime / 1000);

        let timeString = '';
        if (days) timeString += days + 'd ';

        if (hours > 9) timeString += hours + 'h ';
        else if (hours <= 9 && hours > 0) timeString += '0' + hours + 'h ';

        if (minutes > 9) timeString += minutes + 'm ';
        else if (minutes <= 9 && minutes > 0) timeString += '0' + minutes + 'm ';

        if (seconds > 9) timeString += seconds + 's';
        else if (seconds <= 9) timeString += '0' + seconds + 's';

        return timeString;
    }

    return {
        restrict : 'E',
        link : function (scope, element, attrs) {
            let interval = null;
            function display(string) {
                if (!angular.isString(string)) string = string.toString();
                element[0].innerHTML = string;
            }

            function countdownExpired() {
                clearInterval(interval);
                translate('COUNTDOWN_EXPIRED').then(function (translation) {
                    display(translation);
                });
            }

            function startCountdown (countdownTime) {
                clearInterval(interval);
                let timeLeft = countdownTime.getTime() - bsServerTime.now();
                if (timeLeft < 0 ) return countdownExpired();
                else {
                    let waitForFullSecond = timeLeft % 1000;
                    let tick = (timeElapsed) => {
                        timeLeft -= timeElapsed;
                        if (timeLeft <= 0 ) return countdownExpired();
                        display(formatTime(timeLeft));
                    };

                    setTimeout(() => {
                        tick(waitForFullSecond);
                        interval = setInterval(tick.bind(null, 1000), 1000)
                    }, waitForFullSecond);

                    display(formatTime(timeLeft));
                }
            }

            attrs.$observe("to", (newValue) => {
                startCountdown(parseTime(newValue));
            });
        }
    }
}]);