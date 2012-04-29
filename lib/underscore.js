var _ = require('underscore');
_.mixin(require('underscore.string'));
_.indent = function (str, spaces) {
  // DDOPSON-2012-04-13 - There is a bug in V8 matching /^/gm to indent multi-line text.
  // The original code in commander.js used "str.replace(/^/, spaces);"
  // On versions of V8 with the bug, this caused spaces to be inserted into the middle of the usage text, totally borking the alignment
  // The code below is a workaround that fixes the issue on all versions.
  // See http://stackoverflow.com/questions/10150139/bug-in-javascript-regexp-parser-when-matching-beginning-of-line
  // See http://code.google.com/p/v8/source/browse/branches/bleeding_edge/test/mjsunit/regress/regress-1748.js?spec=svn9504&r=9504

  var indent;
  if (_.isString(spaces)) {
    indent = spaces;
  } else if (_.isNumber(spaces)) {
    indent = '';
    for(var i = 0; i < spaces; i++) {
      indent += ' ';
    }
  } else {
    indent = '    ';
  }

  return str.replace(/(^|\n)/g, '$1' + indent);
};

module.exports = _;
