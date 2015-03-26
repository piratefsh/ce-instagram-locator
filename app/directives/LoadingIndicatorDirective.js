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