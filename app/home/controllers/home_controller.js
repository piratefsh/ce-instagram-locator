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
  
}]);