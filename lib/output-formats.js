var util = require('util');
var _ = require('underscore');
var Formatter = require('./formatter');

exports['json'] = {
  description: "Output strictly correct, human-readible JSON w/ smart whitespace",
  stringify: Formatter.withConfig({
    color: false,
    jsonNullBehavior: true, // add 'null' to array when elements are unset or equal to 'undefined' (distinct cases); skip object properties that map to 'undefined'
    quoteKeys: true,
    quotes: '"',
    wrapWidth: 100,
  })
};

exports['dense'] = {
  description: "Output dense JSON using JSON.stringify",
  stringify: function (data) {
    return JSON.stringify(data);
  }
};


exports['pretty'] = {
  description: "Output lax JSON (output is valid JS object syntax, but not strict JSON).",
  stringify: Formatter.withConfig({
    color: true,
    jsonNullBehavior: false,
    quoteKeys: false,
    quotes: "'",
    wrapWidth: 100,
  })
};

exports['text'] = {
  description: "If data is a string, it is printed directly without quotes.  If data is an array, elements are separated by newlines.  Objects and arrays-within-arrays are JSON formated into a single line",
  stringify: function (data) {
    if (! _.isArray(data)) {
      data = [data];
    }
    return _.map(data, function (entry) {
      if (_.isString(entry)) {
        return entry;
      } else {
        return JSON.stringify(entry);
      }
    }).join('\n');
  }
};

exports['inspect'] = {
  description: "Uses Node's 'util.inspect' to print the output",
  stringify: function (data) {
    return util.inspect(data, false, 9999);
  }
};
