var request = require('request');

exports.controller = function controller (api) {
  return function (req, res) {
    if (req.url === '/login' && req.method === 'POST') {
      var body = [], user;
      req.on('end', function () {
        if (req.chunks) {
          req.chunks.forEach(function (chunk) {
            body += chunk;
          });
          try {
            user = JSON.parse(body);
          } catch (e) {
            console.log('Error request not in JSON'.red);
          }
          requestToken(user, api, function (e, r, token) {
            if (e) {
              console.log('ERROR!'.red, 'No se pudo recibir el token'.bold.inverse, e);
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              return res.end('Internal Server Error')
           }
           res.writeHead(200, { 'Content-Type': 'application/json' });
           return res.end(JSON.stringify(token));
         })
       }

     });
    } else {
      res.emit('next');
    }
  }
}


function requestToken (user, api, callback) {
  return request({
    method: 'POST',
    url: api + '/auth/sign-in',
    json: user
  }, callback);
}
