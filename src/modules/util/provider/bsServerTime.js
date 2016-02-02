/**
 * Created by Maximilian on 25.07.2015.
 */

bsSessionModule.provider('bsUtil.bsServerTime', ['$backendURL', function (backendURL) {

    let timeDifference = 0;
    var xmlhttp;

    if ('XMLHttpRequest' in window) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    let roundTripTime = Date.now();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if(xmlhttp.status == 200){
                roundTripTime = Date.now() - roundTripTime;
                let serverTime = new Date(parseInt(xmlhttp.response));
                timeDifference = serverTime.getTime() - Date.now() + (roundTripTime / 2);
            }
        }
    };

    xmlhttp.open("GET", backendURL + '/time', true);
    xmlhttp.send();

    this.$get = [function() {
        return {
            now() {
                return Date.now() + timeDifference;
            },

            date() {
                return new Date(this.now());
            }
        }
    }];
}]);