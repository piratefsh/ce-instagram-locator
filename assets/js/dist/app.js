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
angular.module('app.controllers').controller('HomeController', ['$scope', '$resource', '$interval', '$timeout', function($scope, $resource, $interval, $timeout){
  $scope.now = new Date();
  var uri = "https://api.instagram.com/v1/media/search"

  $scope.latlng = L.latLng("3.133792", "101.686116");

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
            lat: $scope.latlng.lat,
            lng: $scope.latlng.lng
        }).$promise.then(function(response){
            $scope.posts = response.data
        });

    }

    $scope.getMyLocation = function(){
        // find user location
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(location){
                $scope.latlng = L.latLng(location.coords.latitude, location.coords.longitude);
                if($scope.marker) $scope.marker.setLatLng($scope.latlng);
                map.setView($scope.latlng);
                $scope.search();
            });
        }

    }

    $scope.bigMap = false;

    $scope.toggleMapSize = function(){
        $scope.bigMap = !$scope.bigMap;
        $timeout(function(){
            map.invalidateSize();
        }, 400);
    }

    $scope.getMyLocation();

    $scope.search();
    $interval($scope.search, 60000)

    // Map stuff
    L.mapbox.accessToken = "pk.eyJ1IjoicGlyYXRlZnNoIiwiYSI6IjlNT2dMUGcifQ.cj4j9z29wjkXPAi7nK7ArA";

    // create map
    var map = L.mapbox.map('map', 'piratefsh.lmhc5pck');
    map.setView($scope.latlng, 13);

    // create marker
    $scope.marker = L.marker($scope.latlng, {
    });

    map.on('click', function(e){
        map.setView(e.latlng);
        $scope.marker.setLatLng(e.latlng);
        $scope.latlng = e.latlng;
        $scope.search();
    })

    map.addControl(L.mapbox.geocoderControl('mapbox.places', {
        autocomplete: true
    }));

    $scope.controlLocate = L.control.locate().addTo(map);


    $scope.marker.addTo(map);
}]);