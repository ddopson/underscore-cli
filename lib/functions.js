var _ = require('./underscore');
var fs = require('fs');

var functions = _.extend({}, _);
module.exports = functions;

functions['_'] = _;

functions['console'] = console;

// DDOPSON-2012-11-05 - setTimeout, clearTimeout, setInterval, clearInterval would need to be wrapped so that we know not to terminate the program and spew output.
// Unclear if they even make sense to expose to a user expression

functions['print'] = _.bind(console.log, console);

functions['read'] = function (filename) {
  try {
    return fs.readFileSync(filename, 'utf8');
  } catch (e) {
    console.error("Error reading '%s': %s", filename, e.message);
    process.exit(-1);
  }
};

