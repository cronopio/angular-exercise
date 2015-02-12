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

         requestToken(user, api, function (err, token) {
           console.log('Esperando');
         })
       }

       res.writeHead(500, { 'Content-Type': 'text/plain' });
       res.end('Estamos verificando')
     });
    } else {
      res.emit('next');
    }
  }
}


function requestToken (user, api, callback) {
  console.log('U', user.username);
  console.log('P', user.password);
  console.log('Host', api);
  return callback(null);
}
