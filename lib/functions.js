/*jslint sub:true evil:true */

var _ = require('underscore');
_.mixin(require('underscore.string'));

exports = module.exports = _;

exports['_'] = _;

exports['print'] = _.bind(console.log, console);

exports['read'] = function (filename) {
  try {
    return fs.readFileSync(filename, 'utf8');
  } catch (e) {
    console.error("Error reading '%s': %s", filename, e.message);
    process.exit(-1);
  }
};

