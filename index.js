var colors = require('colors'),
    server = require('./lib/server.js');

var PORT = 3000;

server.createServer({
  headers: {
    'x-powered-by': 'Backend for the Exercise v0.0.1'
  },
  api: 'http://backend.api/'
}).listen(PORT, function () {
  console.log('Server started on port:'.yellow, PORT.toString().cyan);
  console.log('Hit CTRL-C to stop the server'.gray);
});

process.on('SIGINT', function () {
  console.log('Server stopped'.red);
  process.exit();
})
