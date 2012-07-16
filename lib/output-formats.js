/*jslint sub:true */
var util = require('util');
var _ = require('underscore');
var Formatter = require('./formatter');

exports['dense'] = {
  description: "Output dense JSON using JSON.stringify",
  stringify: function (data) {
    return JSON.stringify(data);
  }
};

exports['json'] = {
  description: "Output strictly correct, human-readible JSON w/ smart whitespace",
  stringify: Formatter.withConfig({
    color: false,
    jsonNullBehavior: true, // add 'null' to array when elements are unset or equal to 'undefined' (distinct cases); skip object properties that map to 'undefined'
    jsonIgnoreArrayProps: true, // In JS, it's possible to set properties on an Array object.  E.g., (v=[1, 2, 3, 4],v.prop1=true,v).  JSON.stringify ignores these.  When this behavior is 'true', so do we
    quoteKeys: true,
    quotes: '"',
    wrapWidth: 100,
    openBraceOnNewline: false
  })
};

exports['pretty'] = {
  description: "Output lax JSON (output is valid JS object syntax, but not strict JSON).",
  stringify: Formatter.withConfig({
    color: true,
    jsonParity: false,
    quoteKeys: false,
    quotes: '"',
    wrapWidth: 100,
    openBraceOnNewline: false,
    complexObjects: true
  })
};

exports['inspect'] = {
  description: "Uses Node's 'util.inspect' to print the output",
  stringify: function (data) {
    return util.inspect(data, false, 9999);
  }
};

exports['stringify'] = {
  description: "Output formatted JSON using JSON.stringify.  Fairly verbose",
  stringify: function (data) {
    return JSON.stringify(data, null, '  ');
  }
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
