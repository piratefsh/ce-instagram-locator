'use strict';

var controllers = angular.module('app.controllers', []);
var factories = angular.module('app.factories', []);
var models = angular.module('app.models', []);
var directives = angular.module('app.directives', []);
// var services = angular.module('app.services', []);
var dashboard = angular.module('app', 
  ['app.controllers', 'app.factories', 'app.models', 'app.directives',
  'ngRoute', 'ngResource']);

angular.module('app').config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/home/views/home.html',
      controller: 'HomeController'
    })
}]);
// Displays a loading indicator as long as flag is true
angular.module('app.directives').directive('loadingIndicator',['$window', '$location', function($window, $location){
    return{
        restrict: 'E',
        templateUrl: 'app/directives/templates/loading_indicator.html',
        scope: {
            isLoading: '=',
            fullscreen: '=' 
        },
        controller: function($scope, $element){

        }
    }
}]);
angular.module('app.controllers').controller('HomeController', ['$scope', '$resource', function($scope, $resource){
  $scope.now = new Date();
  var uri = "https://api.instagram.com/v1/media/search"

  $scope.lat = "3.133792";
  $scope.lng = "101.686116";

  var Posts = $resource(uri, {
        callback: "JSON_CALLBACK"
    },
    {
        getPosts: {
            method: "JSONP",
            isArray: false,
            params: {
                lat: "@lat",
                lng: "@lng",
                client_id: "e82b3f54c78a4a0fba9aac5d3896fdf0"
            }
        }
    });

    $scope.search = function(){
        Posts.getPosts({
            lat: $scope.lat,
            lng: $scope.lng
        }).$promise.then(function(response){
            $scope.posts = response.data
        })
    }

    $scope.getMyLocation = function(){
        // find user location
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(location){
                $scope.lat = location.coords.latitude;
                $scope.lng = location.coords.longitude;
                $scope.search();
            });
        }
    }

    $scope.getMyLocation();
    $scope.search();

}]);