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
  _.extend(this, config);
}

exports.inspect = inspect;
function inspect(obj, showHidden, depth, colors) {
  var ctx = new Formatter({
    showHidden: showHidden,
    seen: [],
    stylize: colors ? stylizeWithColor : stylizeNoColor,
    quoteString: doubleQuoteString,
    quoteKeys: true,
    wrapWidth: 60
  });
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
    return '\033[' + colors[style][0] + 'm' + str +
           '\033[' + colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (value && typeof value.inspect === 'function' &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    return value.inspect(recurseTimes);
  }

  // Handle null - For some reason typeof null is "object", so special case here.
  if (value === null) {
  }
  
  
  // For some reason typeof null is "object", so special case here.
  var typeof_value = (value === null) ? 'null' : typeof value; 
  
  // Handle primitive types
  switch (typeof_value) {
    case 'null':      return ctx.stylize('null', 'null');
    case 'undefined': return ctx.stylize('undefined', 'undefined');
    case 'string':    return ctx.stylize(ctx.quoteString(value), 'string');
    case 'number':    return ctx.stylize('' + value, 'number');
    case 'boolean':   return ctx.stylize('' + value, 'boolean');

    default:
      break;
  }

  // Look up the keys of the object.
  var visibleKeys = Object.keys(value);
  var keys = ctx.showHidden ? Object.getOwnPropertyNames(value) : visibleKeys;

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (typeof value === 'function') {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  if (ctx.detectTypes) {
    if (typeof value === 'function') {
      var name = value.name ? ': ' + value.name : '';
      base = ' [Function' + name + ']';
    }

    if (isRegExp(value)) {
      base = ' [RegExp: ' + RegExp.prototype.toString.call(value) + ']';
    }

    if (isDate(value)) {
      base = ' [Date: ' + Date.prototype.toUTCString.call(value) + ']';
    }

    if (isError(value)) {
      base = ' [' + Error.prototype.toString.call(value) + ']';
    }
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes === 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      // TODO: count children here
      return ctx.stylize('[...]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  var shouldWrap;
  for(var i in output) {
    
  }
  var length = output.reduce(function(prev, cur) {
    return prev + cur.length + 1;
  }, 0);

  if (length > ctx.wrapWidth && ctx.wrapWidth >= 0) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' + output.join(',\n  ') +
           ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (Object.prototype.hasOwnProperty.call(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
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
