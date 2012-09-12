 
var util = require('util');
var MessagePack = null; // lazy load of require('msgpack')
var _ = require('./underscore');

exports['string'] = {
  description: "Treat the entire input as a single string",
  parse: function (buff) {
    return buff.toString('utf8');
  }
};

exports['text'] = {
  description: "Treat the input as a newline delimited list of strings",
  parse: function (buff) {
    return buff.toString('utf8').split(/\r?\n/);
  }
};

exports['lax'] = {
  description: "Lax JSON parsing using 'eval'",
  parse: function (buff) {
    return eval("ret=" + buff.toString('utf8')); // somehow, adding "ret=" makes this work.  else objects don't parse correctly.  It seems to not cause any issues.
  }
};

exports['strict'] = {
  description: "Strict JSON parsing",
  parse: function (buff) {
    return JSON.parse(buff);
  }
};

exports['msgpack'] = {
  description: 'MessagePack binary JSON format',
  parse: function (buff) {
    if (! MessagePack) {
      MessagePack = require('msgpack');
    }
    return MessagePack.unpack(buff);
  }
};
