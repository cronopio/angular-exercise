var app = angular.module('exerciseHeatMap', []);

function mainController ($scope, $http) {
  $scope.user = {};

  $scope.reqToken = function (creds) {
    $scope.user = angular.copy(creds);
    console.log('Aqui', $scope.user);
    $http.post('/login', $scope.user)
      .success(function (data) {
        console.log('Desde el server', data);
      })
      .error(function (data) {
        console.log('Error', data);
      });
  }
}
