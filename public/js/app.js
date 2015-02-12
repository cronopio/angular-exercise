var app = angular.module('exerciseHeatMap', ['ngCookies']);

function mainController ($scope, $http, $cookieStore) {
  $scope.user = {};

  var authToken = $cookieStore.get('auth');
  if (authToken) {
    loadingImg();
    $http.defaults.headers.common.Authorization = 'Bearer ' + authToken;
    $http.get('/locations').success(function (data, status, headers, config) {
      dibujarMapa(data);
    })
  } else {
    $scope.reqToken = login;
  }

  function login (creds) {
    loadingImg();
    $scope.user = angular.copy(creds);
    $http.post('/login', $scope.user)
      .success(function (data) {
        $scope.user.auth = data;
        if (data.token) {
          $cookieStore.put('auth', data.token);
          $http.defaults.headers.common.Authorization = 'Bearer ' + data.token;
          $http.get('/locations').success(function (data, status, headers, config) {
            dibujarMapa(data);
          })
        } else {
          var msg = '<p>Invalid Credentials.</p><p><a href="/">Click here to try again.</a></p>' 
          $('#main').empty();
          $('#main').append($('<div></div>')
            .addClass('alert alert-danger')
            .attr('role', 'alert')
            .css('width', '70%')
            .css('margin', '2em auto')
            .html(msg));
        }
      })
      .error(function (data) {
        console.log('Error', data);
      });
  }

  function logoutButton () {
    var btn = $('<button></button>').addClass('btn btn-lg btn-primary btn-block').html('Logout');
    btn.css('width', '80%').css('margin', '1em auto');
    btn.click(function () {
      console.log($cookieStore.get('auth'));
      $cookieStore.put('auth', false);
      //$cookieStore.remove('auth');
      console.log($cookieStore.get('auth'));
    });
    $('#main').prepend(btn);
  }

  function dibujarMapa (data) {
    $('#main').empty();
    $('#main').css('height', '90%').css('width', '100%');
    logoutButton();
    $('#main').append($('<div id=\"map-canvas\"></div>').css('height', '100%').css('width', '100%').css('margin', '0px').css('padding', '0px'));

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
  function loadingImg () {
    var img = $('<div></div>')
      .css('background', 'url(/img/ajax-loader.gif) no-repeat center center')
      .css('width', '100%').css('height', '100%')
    $('#main form').hide();
    $('#main').css('height', '100%').css('width', '100%');
    $('#main').append(img);
  }
}