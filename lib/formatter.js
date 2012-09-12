var _ = require('./underscore');
var isArray = _.isArray;
var isDate = _.isDate;
var isRegExp = _.isRegExp;
var isString = _.isString;
var isNumber = _.isNumber;
var isBoolean = _.isBoolean;
var toString = Object.prototype.toString;

function isError(e) {
  return typeof e === 'object' && Object.prototype.toString.call(e) === '[object Error]';
}

function singleQuoteString (str) {
  str = JSON.stringify(str);
  str = str.substr(1, str.length - 2) // strip outter double quotes
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
  'yellow' : [33, 39],
  'orange' : ['1;31', '39;22']
};

// Don't use 'blue' not visible on cmd.exe
var styles = {
  'special': 'cyan',
  'function': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  'name': undefined, // intentionally not styling
  'private': 'grey',
  'regexp': 'red',
  'error': 'orange'
};

function uncolor(str) {
  return str.replace(/\x1B\[[^m]+m/g, '');
}

function stylizeWithColor(str, styleType) {
  if (str === null) {
    return null;
  }
  var style = styles[styleType];

  if (style) {
    str = uncolor(str);
    var real_length = str.length;
    var ret = '\x1B[' + colors[style][0] + 'm' + str + '\x1B[' + colors[style][1] + 'm';
    ret = new String(ret);
    ret.real_length = real_length;
    return ret;
  } else {
    return str;
  }
}

function stylizeWithHtml(str, styleType) {
  if (str === null) {
    return null;
  }
  var style = styles[styleType];

  str = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (style) {
    str = uncolor(str);
    var real_length = str.length;
    var ret = '<span style="color:' + style + '">' + str + '</span>';
    ret = new String(ret);
    ret.real_length = real_length;
    return ret;
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}

function getTypeOf(value) {
  // For some reason typeof null is "object", so special case here.
  var typeof_value = typeof value;

  if (typeof_value === 'object') {
    if (value === null) {
      return 'null';
    }

    switch(toString.call(value)) {
      case '[object Array]':
        return 'array';
      case '[object Date]':
        return 'date';
      case '[object Error]':
        return 'error';
      case '[object RegExp]':
        return 'regexp';
      case '[object String]':
        return 'string'; // new String("foo")) has type 'object'
      case '[object Boolean]':
        return 'boolean'; // new Boolean(true) has type 'object'
      case '[object Number]':
        return 'number'; // new Number(9) has type 'object'
      default:
        return 'object';
    }
  }

  return typeof_value;
}

function formatValue(ctx, value) {
  var typeof_value = getTypeOf(value);
  var atMaxDepth = (ctx.maxDepth !== null && ctx.seen.length >= ctx.maxDepth);

  var formatted = '';
  switch (typeof_value) {
    // Handle primitive types
    case 'null':      formatted = 'null'; break;
    case 'undefined': formatted = 'undefined'; break;
    case 'string':    formatted = ctx.quoteString(value); break;
    case 'number':    formatted = '' + value; break;
    case 'boolean':   formatted = '' + value; break;

  }

  // Special Objects
  if (ctx.jsonParity) {
    switch(typeof_value) {
      case 'date':      formatted = JSON.stringify(value); break;
      case 'error':     typeof_value = 'object'; break;
      case 'regexp':    typeof_value = 'object'; break;
      case 'function':  formatted = null; break;// don't print
    }
  } else {
    switch(typeof_value) {
      case 'date':      formatted = ISO8601(value); break;
      case 'error':     formatted = '[' + Error.prototype.toString.call(value) + ']'; break;
      case 'regexp':    formatted = RegExp.prototype.toString.call(value); break;
      case 'function':  formatted = '[Function' + (value.name ? ': ' + value.name : '') + ']'; break;
    }
  }
  if (formatted !== '') {
    formatted = ctx.stylize(formatted, typeof_value);
  }

  // Array
  if (typeof_value === 'array') {
    if (atMaxDepth) {
      return ctx.stylize('[...]', 'special');
    } else {
      formatted = formatArray(ctx, value);
    }
  }

  // Object and "objects" that have properties
  if (typeof_value === 'object' || (ctx.complexObjects && typeof value === 'object' && value !== null)) {
    if (atMaxDepth) {
      if (formatObject(ctx, value, typeof_value) !== '') {
        formatted += ctx.stylize('{...}', 'special');
      }
    } else {
      formatted += formatObject(ctx, value, typeof_value);
    }
  }

  return formatted;
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


function joinCollection(ctx, entries, b1, b2, insideObject) {
  if (entries.length === 0) {
    return b1 + ctx.space + b2;
  }
  var shouldWrap = false;
  var length = b1.length + b2.length;
  if (ctx.wrapWidth >= 0) {
    length += (entries.length - 1) * (1 + ctx.space.length); // separators
    for(var i = 0, l = entries.length; i < l; i++) {
      length += (entries[i].real_length || entries[i].length);
      if (length > ctx.wrapWidth) {
        shouldWrap = true;
        break;
      }
    }
  }

  var ret;
  if (shouldWrap) {
    ret = b1 + ctx.cr + ctx.indent + entries.join(',' + ctx.cr + ctx.indent) + ctx.cr + b2;
  } else {
    var sp = insideObject ? ctx.space : '';
    ret = b1 + sp + entries.join(',' + ctx.space) + sp + b2;
    ret = new String(ret);
    ret.real_length = length; // needed for correct line wrapping in the presence of ANSI color escapes
  }
  return ret;
}

function formatArray(ctx, value) {
  ctx.seen.push(value);

  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (Object.prototype.hasOwnProperty.call(value, String(i))) {
      if (ctx.jsonParity && value[i] === undefined) {
        // jsonParity: when array entries are equal to 'undefined', JSON.stringify prints 'null'
        output.push(ctx.stylize('null', 'null'));
      } else {
        output.push(formatProperty(ctx, value, String(i), false, true));
      }
    } else {
      // jsonParity: when value entries are unset, JSON.stringify prints 'null'
      output.push(ctx.jsonParity ? ctx.stylize('null', 'null') : '');
    }
  }


  ctx.seen.pop();

  return joinCollection(ctx, output, '[', ']');
}

function formatObject(ctx, value, type) {
  ctx.seen.push(value);

  var visibleKeys = Object.keys(value);
  var output = visibleKeys.map(function(key) {
    if (type === 'array' && key.match(/^\d+$/)) {
      return null;
    }
    return formatProperty(ctx, value, key, false, false);
  });

  if (ctx.showHidden) {
    var touched = {};
    visibleKeys.map(function(key) {
      touched[key] = true;
    });
    var allKeys = Object.getOwnPropertyNames(value);
    allKeys.map(function (key) {
      if (! touched[key]) {
        output.push(formatProperty(ctx, value, key, true, false));
      }
    });
  }

  // skip nulls (keys which are being ignored by current config)
  output = _.filter(output, function (v) { return v !== null; });

  ctx.seen.pop();

  if (type !== 'object' && output.length === 0) {
    return '';
  } else {
    return joinCollection(ctx, output, '{', '}', true);
  }
}

function formatProperty(ctx, obj, key, isPrivate, inside_array) {
  if (ctx.jsonParity && obj[key] === undefined) {
    return null; // jsonParity: properties that are equal to 'undefined' are not printed
  }

  var desc = Object.getOwnPropertyDescriptor(obj, key) || { value: obj[key] };
  var str;
  if (desc.get || desc.set) {
    if (! ctx.showAccessors) {
      return null;
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
  } else if (ctx.seen.indexOf(desc.value) > -1) {
    str = ctx.stylize('[Circular]', 'special');
  } else {
    str = formatValue(ctx, desc.value);
    if (str === null) {
      return null; // skip key (e.g. functions in JSON mode)
    }
    if (str.indexOf('\n') > -1) {
      str = str.split('\n').join('\n' + ctx.indent);
      if (ctx.openBraceOnNewline) {
        str = '\n' + ctx.indent + str;
      }
    }
  }

  if (inside_array && key.match(/^\d+$/)) {
    return str;
  } else {
    return formatKey(ctx, key, isPrivate) + ':' + ctx.space + str;
  }
}

function formatKey(ctx, key, isPrivate) {
  var name = '' + key;
  if (isPrivate) {
    return ctx.stylize('[' + name + ']', 'private');
  } else if (! ctx.quoteKeys && name.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
    return ctx.stylize(name, 'name');
  } else {
    name = ctx.quoteString(name);
    return ctx.stylize(name, 'name');
  }
}

function Formatter (config) {
  var ctx = {};

  // Booleans
  ctx.showHidden           = config.showHidden;
  ctx.showAccessors        = config.showAccessors;
  ctx.quoteKeys            = config.quoteKeys;
  ctx.modelUndefinedAsNull = config.modelUndefinedAsNull;
  ctx.openBraceOnNewline   = config.openBraceOnNewline;
  ctx.jsonParity           = config.jsonParity;
  ctx.complexObjects       = config.complexObjects;

  // Method Selection
  ctx.stylize         = (config.color) ? (config.color === 'html' ? stylizeWithHtml : stylizeWithColor) : stylizeNoColor;
  ctx.quoteString     = (config.quotes === "'") ? singleQuoteString : doubleQuoteString;

  // Other
  ctx.wrapWidth = config.wrapWidth;
  ctx.maxDepth  = config.maxDepth;
  ctx.space     = config.space;
  ctx.indent    = config.indent;
  ctx.cr        = config.cr;

  var formatter = function (value) {
    ctx.seen = [];
    return ""+formatValue(ctx, value, ctx.maxDepth);
  };
  formatter.withConfig = withConfig;
  formatter.ctx = ctx;
  formatter.config = config;
  return formatter;
}

module.exports = new Formatter({
  showHidden: false,
  color: false,
  quotes: '"',
  space: ' ',
  indent: '  ',
  cr: '\n',
  quoteKeys: true,
  showAccessors: false,
  jsonParity: true,
  // jsonParity: 1) add 'null' to array when elements are unset or equal to 'undefined' (distinct cases); skip object properties that map to 'undefined'
  wrapWidth: 100,
  maxDepth: null,
  complexObjects: false
});

function withConfig(config) {
  if (typeof config !== 'object') {
    throw new Error('expected object');
  }
  return new Formatter(_.extend({}, this.config, config));
}
