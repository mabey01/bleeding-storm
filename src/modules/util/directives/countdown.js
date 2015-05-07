/**
 * Created by Maximilian on 06.05.2015.
 */

bsUtilModule.directive('bsCountdown', [function () {

    var parseTime = function(timeString) {
        var time = Date.parse(timeString);

        if (time.prototype != 'Date') {
            time = new Date(timeString)
        }

        if (time.prototype != 'Date') {
            time = new Date(parseInt(timeString))
        }

        return time;
    };

    var formatTime = function(time) {
        var helpTime = time;

        var days = parseInt(helpTime / (24*60*60*1000));
        helpTime -= days * (24*60*60*1000);

        var hours = parseInt(helpTime / (60*60*1000));
        helpTime -= hours * (60*60*1000);

        var minutes = parseInt(helpTime / (60*1000));
        helpTime -= minutes * (60*1000);

        var seconds = parseInt(helpTime / 1000);

        var timeString = '';
        if (days) timeString += days + 'd ';

        if (hours > 9) timeString += hours + 'h ';
        else if (hours <= 9 && hours > 0) timeString += '0' + hours + 'h ';

        if (minutes > 9) timeString += minutes + 'm ';
        else if (minutes <= 9 && minutes > 0) timeString += '0' + minutes + 'm ';

        if (seconds > 9) timeString += seconds + 's';
        else if (seconds <= 9) timeString += '0' + seconds + 's';

        return timeString;
    };

    return {
        restrict : 'E',
        link : function (scope, element, attrs) {
            var countdownTo = parseTime(attrs.to);
            var timeLeft = countdownTo.getTime() - Date.now();
            if (timeLeft < 0 ) return element.html('Countdown expired');
            else {
                element.html(formatTime(timeLeft));
                setInterval(function () {
                    timeLeft -= 1000;
                    element.html(formatTime(timeLeft));
                }, 1000)
            }
        }
    }
}]);