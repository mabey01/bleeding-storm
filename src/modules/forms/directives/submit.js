/**
 * Created by Maximilian on 28.04.2015.
 */

bsFormsModule.directive('bsFormsSubmit', [function() {

    var stripSpace = function(string) {
        let newString = string.replace(' ', '');
        if (newString != string) return stripSpace(newString);
        else return newString;
    };

    var selectAll = function(document, ...selectors) {
        let selectedNodes = [];
        selectors.forEach(function(selector) {
            let cleanSelector = stripSpace(selector);
            selectedNodes = selectedNodes.concat(Array.prototype.slice.call(document.querySelectorAll(cleanSelector)));
        });

        return selectedNodes;
    };

    return {
        restrict : 'A',
        scope : {
            onSubmit : '&bsFormsSubmit'
        },
        link : function(scope, element, attrs, controller) {
            var submitFN = scope.onSubmit;

            element.on('submit', function(event) {
                let inputs = selectAll(event.srcElement, 'input', 'textarea');
                var form = {};

                inputs.forEach(function (input) {
                    var name = input.name || input.id;
                    var value = input.value;
                    if (value == '' || name == '') return;

                    let selector = input.tagName.toLowerCase();
                    if (input.type) {
                        selector += '.' + input.type;
                    }

                    switch (selector) {
                        case 'input.text' :
                            form[name] = input.value.toString();
                            break;
                        case 'input.time' :
                            var time = value.split(":");
                            form[name] = {
                                hours : parseInt(time[0]),
                                minutes : parseInt(time[1])
                            };
                            break;
                        case 'input.date' :
                            form[name] = new Date(input.value);
                            break;
                        case 'textarea.textarea' :
                            form[name] = value;
                            break;
                    }
                });

                submitFN({form : form});
            })
        }
    }
}]);