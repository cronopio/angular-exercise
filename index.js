var colors = require('colors'),
    argv = require('optimist').string('api').argv;
    server = require('./lib/server.js');

var PORT = 3000;

if (argv.h || argv.help || !argv.api) {
  console.log([
    "usage: node index.js --api <backendAPI>",
    "",
    "options:",
    "  --api        URL of the backend api",
    "",
    "  -h --help    Print this list and exit."
  ].join('\n'));
  process.exit();
}

server.createServer({
  headers: {
    'x-powered-by': 'Backend for the Exercise v0.0.1'
  },
  api: argv.api
}).listen(PORT, function () {
  console.log('Server started on port:'.yellow, PORT.toString().cyan);
  console.log('Backend API:'.yellow, argv.api.cyan);
  console.log('Hit CTRL-C to stop the server'.gray);
});

process.on('SIGINT', function () {
  console.log('Server stopped'.red);
  process.exit();
})
