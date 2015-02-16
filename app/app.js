'use strict';

var controllers = angular.module('app.controllers', []);
var factories = angular.module('app.factories', []);
var models = angular.module('app.models', []);
var directives = angular.module('app.directives', []);
// var services = angular.module('app.services', []);
var dashboard = angular.module('app', 
  ['app.controllers', 'app.factories', 'app.models', 'app.directives',
  'ngRoute']);

angular.module('app').config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/home/views/home.html',
      controller: 'HomeController'
    })
}]);