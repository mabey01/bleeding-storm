/**
 * Created by Maximilian on 06.05.2015.
 */

var bsUtilModule = angular.module('bsUtil', [])
    .constant('$backendURL', 'http://localhost:4444')
    .constant('$frontendURL', window.location.origin + window.location.pathname);