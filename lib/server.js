var colors = require('colors'),
    ecstatic = require('ecstatic'),
    union = require('union'),
    login = require('./login.js'),
    locations = require('./locations.js');

var HTTPServer = exports.HTTPServer = function (options) {
  options = options || {};

  if (options.headers) {
    this.headers = options.headers;
  }

  var serverOptions = {
    before: [logger(),
      login.controller(options.api),
      locations.controller(options.api),
      ecstatic({
        root: './public',
        cache: 3600,
        showDir: false,
        autoIndex: true,
        defaultExt: 'html'
      })
    ],
    headers: this.headers || {}
  }

  this.server = union.createServer(serverOptions);
}

HTTPServer.prototype.listen = function () {
  this.server.listen.apply(this.server, arguments);
}

HTTPServer.prototype.close = function () {
  return this.server.close();
}

exports.createServer = function (opts) {
  return new HTTPServer(opts);
}

function logger() {
  return function (req, res) {
    console.log('[%s] "%s %s" "%s"', (new Date).toUTCString(), req.method.cyan, req.url.cyan, req.headers['user-agent']);
    res.emit('next');
 }
}
