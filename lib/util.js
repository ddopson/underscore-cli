var _ = require('underscore');
var isArray = _.isArray;
var isDate = _.isDate;
var isRegExp = _.isRegExp;

function isError(e) {
  return typeof e === 'object' && Object.prototype.toString.call(e) === '[object Error]';
}

exports = module.exports = Formatter;
function Formatter (config) {
  if (! this instanceof Formatter) {
    return new Formatter(config);
  }
  this.seen = [];
  _.extend(this, {
    seen: [],
    showHidden: false,
    stylize: stylizeWithColor,
    quoteString: doubleQuoteString,
    quoteKeys: true,
    showAccessors: true,
    formatDate: dateFormats['jsonParity'],
    formatError: errorFormats['jsonParity'],
    formatRegExp: regexFormats['jsonParity'],
    formatFunction: functionFormats['jsonParity'],
    wrapWidth: 80

  }, config);
}

Formatter.prototype.formatValue = formatValue;
Formatter.prototype.formatObject = formatObject;
Formatter.prototype.formatArray = formatArray;
Formatter.prototype.formatKey = formatKey;
Formatter.prototype.formatProperty = formatProperty;
Formatter.prototype.joinCollection = joinCollection;

exports.inspect = inspect;
function inspect(obj, config) {
  var ctx = new Formatter(config || {});
  return formatValue(ctx, obj, (typeof depth === 'undefined' ? null : depth));
}


function singleQuoteString (str) {
  str = JSON.stringify(str)
    .substr(1, name.length - 2) // strip outter double quotes
    .replace(/'/g, "\\'")       // escape single quotes
    .replace(/\\"/g, '"');      // unescape double quotes
  return "'" + str + "'";
}

function doubleQuoteString (str) {
  return JSON.stringify(str);
}

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
var colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
var styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = styles[styleType];

  if (style) {
    return '\033[' + colors[style][0] + 'm' + str + '\033[' + colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}

function getTypeOf(value) {
  // For some reason typeof null is "object", so special case here.
  var typeof_value = (value === null) ? 'null' : typeof value; 
  
  if (typeof_value === 'object') {
    if (isArray(value)) {
      return 'array';
    } else if (isDate(value)) {
      return 'date';
    } else if (isError(value)) {
      return 'error';
    } else if (isRegExp(value)) {
      return 'regexp';
    }
  }

  return typeof_value;
}

function formatValue(ctx, value, recurseTimes) {
  var typeof_value = getTypeOf(value);
  
  // Handle primitive types
  switch (typeof_value) {
    case 'null':      return ctx.stylize('null', 'null');
    case 'undefined': return ctx.stylize('undefined', 'undefined');
    case 'string':    return ctx.stylize(ctx.quoteString(value), 'string');
    case 'number':    return ctx.stylize('' + value, 'number');
    case 'boolean':   return ctx.stylize('' + value, 'boolean');
  }

  switch (typeof_value) {
    case 'date':      return ctx.stylize(ctx.formatDate(ctx, value, recurseTimes), 'date');
    case 'error':     return ctx.stylize(ctx.formatError(ctx, value, recurseTimes), 'error');
    case 'regexp':    return ctx.stylize(ctx.formatRegExp(ctx, value, recurseTimes), 'regexp');
    case 'function':  return ctx.stylize(ctx.formatFunction(ctx, value, recurseTimes), 'special');
  }

  if (recurseTimes === 0) {
    return ctx.stylize('[...]', 'special');
  }

  switch (typeof_value) {
    case 'object':    return ctx.formatObject(ctx, value, recurseTimes);
    case 'array':     return ctx.formatArray(ctx, value, recurseTimes);
  }
}

function ISO8601(d) {
  function f2(n) {
    // Format integers to have at least two digits.
    return (n < 10) ? ('0' + n) : n;
  }
  function f3(n) {
    // Format integers to have at least three digits.
    return (n < 10) ? ('00' + n) : (n < 100) ? ('0' + n) : n;
  }

  return d.getUTCFullYear()   + '-' +
    f2(d.getUTCMonth() + 1)   + '-' +
    f2(d.getUTCDate())        + 'T' +
    f2(d.getUTCHours())       + ':' +
    f2(d.getUTCMinutes())     + ':' +
    f2(d.getUTCSeconds())     + '.' +
    f3(d.getMilliseconds())   + 'Z';
}

var dateFormats = {
  // short:   2012-10-19T12:33:12.123Z
  // parity:  "2012-10-19T12:33:12.123Z"
  // full:    {2012-10-19T12:33:12.123Z, a: 99, b: 99, c: 99}
  // compat:  "{2012-10-19T12:33:12.123Z, a: 99, b: 99, c: 99}"
  jsonParity: function (ctx, value, recurseTimes) {
    return JSON.stringify(value);
  },
  short: function (ctx, value, recurseTimes) {
    return ISO8601(value);
  },
}

var errorFormats = {
  jsonParity: function (ctx, value, recurseTimes) {
    return formatObject(ctx, value, recurseTimes); 
  },
  oldInspect: function (ctx, value, recurseTimes) {
    return ' [' + Error.prototype.toString.call(value) + ']';
  }
}

var regexFormats = {
  // short:   /asdf/
  // parity:  {a: 99, b: 99, c: 99}
  // full:    {/asdf/, a: 99, b: 99, c: 99}
  // compat:  "{/asdf/, a: 99, b: 99, c: 99}"
  jsonParity: function (ctx, value, recurseTimes) {
    return formatObject(ctx, value, recurseTimes); 
  },
  oldInspect: function (ctx, value, recurseTimes) {
    return ' [RegExp: ' + RegExp.prototype.toString.call(value) + ']';
  }
}

var functionFormats = {
  // short: 
  // parity: 
  jsonParity: function (ctx, value, recurseTimes) {
    return '';
  },
  oldInspect: function (ctx, value, recurseTimes) {
    var name = value.name ? ': ' + value.name : '';
    return ' [Function' + name + ']';
  }
}

function joinCollection(ctx, entries, braces) {
  var shouldWrap = false;
  if (ctx.wrapWidth >= 0) {
    var length = 0;
    for(var i = 0, l = entries.length; i < l; i++) {
      length += entries[i].length + 1; // should this be +2 ??
      if (length > ctx.wrapWidth) {
        shouldWrap = true;
        break;
      }
    }
  }

  if (shouldWrap) {
    return entries.join(',\n  ');
  } else {
    return entries.join(', ');
  }
}

function formatArray(ctx, value, recurseTimes) {
  // Look up the keys of the object.
  var visibleKeys = Object.keys(value);
  var keys = ctx.showHidden ? Object.getOwnPropertyNames(value) : visibleKeys;
  
  var output = [];
  
  ctx.seen.push(value);
  
  for (var i = 0, l = value.length; i < l; ++i) {
    if (Object.prototype.hasOwnProperty.call(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('null');
    }
  }
 
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  
  ctx.seen.pop();

  return '[' + joinCollection(ctx, output) + ']';
}

function formatObject(ctx, value, recurseTimes) {
  // Look up the keys of the object.
  var visibleKeys = Object.keys(value);
  var keys = ctx.showHidden ? Object.getOwnPropertyNames(value) : visibleKeys;
  
  ctx.seen.push(value);
  
  var output = keys.map(function(key) {
    return formatProperty(ctx, value, recurseTimes, visibleKeys, key, false);
  });
  
  ctx.seen.pop();

  return '{' + joinCollection(ctx, output) + '}';
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get || desc.set) {
    if (! ctx.showAccessors) {
      return '';
    }
    if (desc.get) {
      if (desc.set) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }

  if (!str) {
    if (ctx.seen.indexOf(desc.value) > -1) {
      str = ctx.stylize('[Circular]', 'special');
    } else {
      str = formatValue(ctx, desc.value, (recurseTimes === null) ? null : recurseTimes - 1);
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    }
  }

  var isPrivate = (visibleKeys.indexOf(key) < 0) ? true : false;
  
  if (isPrivate) {
    return '[' + key + ']: ' + str;
  } else if (array && key.match(/^\d+$/)) {
    return str;
  } else {
    return formatKey(ctx, key) + ': ' + str;
  }
}

function formatKey(ctx, key) {
  var name = '' + key;
  if (! ctx.quoteKeys && name.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
    return ctx.stylize(name, 'name');
  } else {
    name = ctx.quoteString(name);
    return ctx.stylize(name, 'string');
  }
}


