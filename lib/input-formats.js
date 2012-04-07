var util = require('util');
var _ = require('underscore');

exports['text-as-string'] = {
  description: "Treat the entire input as a single string",
  input: function (text) {
    return text;
  }
};

exports['lax'] = {
  description: "Lax JSON parsing using 'eval'",
  input: function (text) {
    return text;
  }
};

exports['strict'] = {
  description: "Strict JSON parsing",
  input: function (text) {
    return JSON.parse(text);
  }
};
