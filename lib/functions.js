var _ = require('underscore');
_.mixin(require('underscore.string'));
var fs = require('fs');

var functions = _.extend({}, _);
module.exports = functions;

functions['_'] = _;

functions['print'] = _.bind(console.log, console);

functions['read'] = function (filename) {
  try {
    return fs.readFileSync(filename, 'utf8');
  } catch (e) {
    console.error("Error reading '%s': %s", filename, e.message);
    process.exit(-1);
  }
};

