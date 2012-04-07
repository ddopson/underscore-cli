var util = require('util');
var _ = require('underscore');
var JSON2 = require('JSON');

exports['json'] = {
  description: "Output dense JSON",
  output: function (data) {
    return JSON.stringify(data);
  }
};

exports['json-pretty'] = {
  description: "Output JSON with whitespace (still strict JSON)",
  output: function (data) {
    return JSON.stringify(data);
  }
};

exports['lax'] = {
  description: "Uses 'util.inspect' to print valid Javascript",
  output: function (data) {
    return util.inspect(data, false, 9999);
  }
};
