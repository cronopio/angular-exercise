var request = require('request'),
    async = require('async');

exports.controller = function controller (api) {
  return function (req, res) {
    if (req.url === '/locations') {
      // Lets create 4 requests to get more results that the page limit(10)
      var all = [], pageCount = 1;
      request.get({
        url: api+'/visits',
        headers: { Authorization: req.headers.authorization },
        json:true
      }, function (e, r, b) {
        if (e || !b.meta) {
          console.log('ERROR!'.red, 'Can\'t get the locations.'.bold.inverse, e);
          console.log('Meta info'.grey, b.meta);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('Internal Server Error')
        }
        var records = b.meta.pagination.records
        console.log('Enviando'.cyan, records.toString().bold.red, 'registros...'.cyan);
        var now = new Date().getTime();
        async.whilst(function () { return all.length < records }, function (cb) {
          requestLocations(req.headers.authorization, api, pageCount, function (err, locations) {
            if (err) return cb(err);
            all = all.concat(locations);
            pageCount++;
            cb(null);
          })
        }, function (er) {
          if (er) {
            console.log('ERROR!'.red, 'Can\'t get the locations.'.bold.inverse, er);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Internal Server Error')
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
