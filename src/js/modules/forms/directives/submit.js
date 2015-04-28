/**
 * Created by Maximilian on 28.04.2015.
 */

bsFormsModule.directive('bsFormsSubmit', [function() {
    return {
        restrict : 'A',
        scope : {
            onSubmit : '&bsFormsSubmit'
        },
        link : function(scope, element, attrs, controller) {
            var submitFN = scope.onSubmit;

            element.on('submit', function(event) {
                var inpputs = event.srcElement.querySelectorAll('input');
                var form = {};

                for (var i = 0; i <	inpputs.length; i++) {
                    var input = inpputs[i];
                    var name = input.name || input.id;
                    var value = input.value;
                    if (value == '') continue;

                    switch (input.type) {
                        case 'text' :
                            form[name] = input.value.toString();
                            break;
                        case 'time' :
                            var time = value.split(":");
                            form[name] = {
                                hours : parseInt(time[0]),
                                minutes : parseInt(time[1])
                            };
                            break;
                        case 'date' :
                            form[name] = new Date(input.value);
                            break;
                    }
                }

                submitFN({form : form});
            })
        }
    }
}]);