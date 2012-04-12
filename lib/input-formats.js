var util = require('util');
var _ = require('underscore');

exports['string'] = {
  description: "Treat the entire input as a single string",
  parse: function (text) {
    return text;
  }
};

exports['lax'] = {
  description: "Lax JSON parsing using 'eval'",
  parse: function (text) {
    return eval("ret=" + text); // somehow, adding "ret=" makes this work.  else objects don't parse correctly.  It seems to not cause any issues.
  }
};

exports['strict'] = {
  description: "Strict JSON parsing",
  parse: function (text) {
    return JSON.parse(text);
  }
};
