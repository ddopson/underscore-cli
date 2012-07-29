var fs = require('fs');
var _ = require('underscore');
var Module = require('module');
var path = require('path');

////////////////////////////////////////////////////////////////////////////////////////////////////
// From: module.js
////////////////////////////////////////////////////////////////////////////////////////////////////

// DDOPSON-2012-04-28 - stealing this method from module.js ... seems pretty corner-case
function stripBOM(content) {
  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// From: underscore.js
////////////////////////////////////////////////////////////////////////////////////////////////////

// When customizing `templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
var noMatch = /.^/;

// Certain characters need to be escaped so that they can be put into a
// string literal.
var escapes = {
  '\\': '\\',
  "'": "'",
  'r': '\r',
  'N': '\n',
  't': '\t',
  'u2028': '\u2028',
  'u2029': '\u2029'
};

for (var p in escapes) { escapes[escapes[p]] = p; }
var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
var unescaper = /\\(\\|'|r|N|t|u2028|u2029)/g;

// Within an interpolation, evaluation, or escaping, remove HTML escaping
// that had been previously added.
var unescape = function(code) {
  return code.replace(unescaper, function(match, escape) {
    return escapes[escape];
  });
};

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.

// DDOPSON-2012-04-29 - The method below is written such that the line numbers are in perfect 1:1 correlation between the .template file and the generated JS code.  This means that stacks will have correct line numbers
function parseTemplate(text) {
  var settings = _.templateSettings;

  // Compile the template source, taking care to escape characters that
  // cannot be included in a string literal and then unescape them in code
  // blocks.
  
  var source = "__p+='" + text
    .replace(escaper, function(match) {
      return '\\' + escapes[match];
    })
    .replace(settings.escape || noMatch, function(match, code) {
      return "'+_.escape(" + unescape(code) + ")+'";
    })
    .replace(settings.interpolate || noMatch, function(match, code) {
      return "'+(" + unescape(code) + ")+'";
    })
    .replace(settings.evaluate || noMatch, function(match, code) {
      return "';" + unescape(code) + ";__p+='";
    }) + "';";

  // If a variable is not specified, place data values in local scope.
  if (!settings.variable) {
    source = 'with(obj||{}){' + source + '}';
  }

  source = 'function(' + (settings.variable || 'obj') + '){' +
    "var __p='', print=function(){__p+=Array.prototype.join.call(arguments, '')};" +
    source + " return __p; }";
  source = source.replace(/\\N/g, "\\n'+\n'");
  return source;
}


// when loaded as require('foo.template'), text == undefined
// This allows using require() to import a template as a fn
require.extensions['.template'] = function requireDotTemplate(module, filename, text) {
  text = stripBOM(text ? text : fs.readFileSync(filename, 'utf8'));
  var source = "module.exports = " + parseTemplate(text);
  module._compile(source, filename);
  module.exports.source = source;
};


// This is similar to what happens when require() loads a module, but allows us to pass in the text instead of searching the file-system
exports.compile = function (filename, text) {
  filename = path.resolve(filename);
  var m = new Module(filename, module);
  m.filename = filename;
  m.paths = Module._nodeModulePaths(path.dirname(filename));
  require.extensions['.template'](m, filename, text);
  m.loaded = true;
  return m.exports;
};
