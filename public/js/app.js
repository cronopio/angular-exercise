var app = angular.module('exerciseHeatMap', []);

function mainController ($scope, $http) {
  $scope.user = {};

  $scope.reqToken = function (creds) {
    $scope.user = angular.copy(creds);
    console.log('Aqui', $scope.user);
    $http.post('/login', $scope.user)
      .success(function (data) {
        $scope.user.auth = data;
        dibujarMapa();
      })
      .error(function (data) {
        console.log('Error', data);
      });
  }
}

function dibujarMapa () {
  $('body').empty();
  $('html, body').css('height', '100%').css('width', '100%');
  $('body').append($('<div id=\"map-canvas\"></div>').css('height', '100%').css('width', '100%').css('margin', '0px').css('padding', '0px'));
  var a = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 13,
    center: new google.maps.LatLng(37.774546, -122.433523),
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });
}
