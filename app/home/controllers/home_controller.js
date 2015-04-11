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
                $scope.latlng.lat = location.coords.latitude;
                $scope.latlng.lng = location.coords.longitude;
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

    $interval($scope.search, 60000)
    $scope.search();

    // Map stuff
    L.mapbox.accessToken = "pk.eyJ1IjoicGlyYXRlZnNoIiwiYSI6IjlNT2dMUGcifQ.cj4j9z29wjkXPAi7nK7ArA";

    // create map
    var map = L.mapbox.map('map', 'piratefsh.lmhc5pck');
    map.setView($scope.latlng, 10);

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