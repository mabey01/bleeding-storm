/**
 * Created by Maximilian on 06.05.2015.
 */

bsUtilModule.directive('bsCountdown', [function () {

    let parseTime = function(timeString) {
        let time = Date.parse(timeString);

        if (time.prototype != 'Date') {
            time = new Date(timeString)
        }

        if (time.prototype != 'Date') {
            time = new Date(parseInt(timeString))
        }

        return time;
    };

    let formatTime = function(time) {
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
    };

    return {
        restrict : 'E',
        link : function (scope, element, attrs) {
            let display = (string) => {
                if (!angular.isString(string)) string = string.toString();
                element[0].innerHTML = string;
            };

            let countdownTo = parseTime(attrs.to);
            let timeLeft = countdownTo.getTime() - Date.now();
            if (timeLeft < 0 ) return display('Countdown expired');
            else {
                display(formatTime(timeLeft));
                setInterval(() => {
                    timeLeft -= 1000;
                    display(formatTime(timeLeft));
                }, 1000)
            }
        }
    }
}]);