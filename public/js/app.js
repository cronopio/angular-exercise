var app = angular.module('exerciseHeatMap', ['ngCookies']);

function mainController ($scope, $http, $cookies) {
  $scope.user = {};

  $scope.reqToken = function (creds) {
    $scope.user = angular.copy(creds);
    $http.post('/login', $scope.user)
      .success(function (data) {
        $scope.user.auth = data;
        if (data.token) {
          $cookies.auth = data.token;
          $http.defaults.headers.common.Authorization = 'Bearer ' + data.token;
          $http.get('/locations').success(function (data, status, headers, config) {
            dibujarMapa(data);
          })
        } else {
          var msg = '<p>Invalid Credentials.</p><p><a href="/">Click here to try again.</a></p>' 
          $('body').empty();
          $('body').append($('<div></div>').addClass('alert alert-danger').attr('role', 'alert').css('width', '70%').css('margin', '0px auto').html(msg));
        }
      })
      .error(function (data) {
        console.log('Error', data);
      });
  }

  var authToken = $cookies.auth;
  if (authToken) {
    $http.defaults.headers.common.Authorization = 'Bearer ' + authToken;
    $http.get('/locations').success(function (data, status, headers, config) {
      dibujarMapa(data);
    })
  }
}

function dibujarMapa (data) {
  $('body').empty();
  $('html, body').css('height', '100%').css('width', '100%');
  $('body').append($('<div id=\"map-canvas\"></div>').css('height', '100%').css('width', '100%').css('margin', '0px').css('padding', '0px'));

  var latlngbounds = new google.maps.LatLngBounds();
  var points = data.map(function (p) {
    return new google.maps.LatLng(p.latitude, p.longitude);
  });

  for (var i = 0, LtLgLen = points.length; i < LtLgLen; i++) {
    latlngbounds.extend(points[i]);
  }

  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 13,
    center: latlngbounds.getCenter(),
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });
  map.setCenter(latlngbounds.getCenter());
  map.fitBounds(latlngbounds);

  var pointArray = new google.maps.MVCArray(points);

  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray
    });

  heatmap.setMap(map);
}

