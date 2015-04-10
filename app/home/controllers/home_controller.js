angular.module('app.controllers').controller('HomeController', ['$scope', '$resource', function($scope, $resource){
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

    // Map stuff
    L.mapbox.accessToken = "pk.eyJ1IjoicGlyYXRlZnNoIiwiYSI6IjlNT2dMUGcifQ.cj4j9z29wjkXPAi7nK7ArA";

    // create map
    var map = L.mapbox.map('map', 'piratefsh.lmhc5pck');
    map.setView($scope.latlng, 10);

    // create marker
    var marker = L.marker($scope.latlng, {
    });

    map.on('click', function(e){
        map.setView(e.latlng);
        marker.setLatLng(e.latlng);
        $scope.latlng = e.latlng;
        $scope.search();
    })

    marker.addTo(map);
}]);