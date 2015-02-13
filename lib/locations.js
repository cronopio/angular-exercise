var request = require('request'),
    async = require('async');

exports.controller = function controller (api) {
  return function (req, res) {
    if (req.url === '/locations') {
      request.get({
        url: api+'/visits',
        headers: { Authorization: req.headers.authorization },
        json:true
      }, function (e, r, b) {
        if (e || !b.meta) {
          console.log('ERROR!'.red, 'Can\'t get the locations.'.bold.inverse, e);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('Internal Server Error')
        }

        function getPage (page) {
          return function (cb) {
            requestLocations(req.headers.authorization, api, page, cb);
          }
        }

        var allFns = [];
        for (var i=1; i<=b.meta.pagination.pages; i++) {
          allFns.push(getPage(i));
        }
        var records = b.meta.pagination.records
        console.log('Enviando'.cyan, records.toString().bold.red, 'registros...'.cyan);
        var now = new Date().getTime();
        async.parallel(allFns, function (er, allPoints) {
          if (er) {
            console.log('ERROR!'.red, 'Can\'t get the locations.'.bold.inverse, er);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Internal Server Error')
          }
          var all = []
          for (var j=0; j<allPoints.length; j++) {
            for (var k=0; k<allPoints[j].length; k++) {
              all.push(allPoints[j][k]);
            }
          }
          // At this point we have ALL the points to answer.
          var total = (new Date().getTime() - now) / 1000;
          console.log(all.length.toString().bold.red, 'registros enviados correctamente en'.cyan, total.toString().bold.red, 'segundos'.cyan);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(all));
        });
      })
    } else {
      res.emit('next');
    }
  }
}

function requestLocations (auth, api, page, callback) {
  if (typeof page === 'function') {
    callback = page;
    page = 1;
  }
  var opts = {
    method: 'GET',
    url: api + '/visits?page=' + page,
    headers: {
      Authorization: auth
    },
    json: true
  }

  request(opts, function (err, response, body) {
    if (body && body.visits && body.visits.length > 0) {
      var nuevos = body.visits.map(function (i){
        return {
          longitude: i.longitude,
          latitude: i.latitude
        };
      });
      return callback(null, nuevos);
    }
  })
}
