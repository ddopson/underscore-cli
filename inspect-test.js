#!/usr/bin/env node

var util = require('util');
var Formatter = require('./lib/formatter');

var obj = require('./example-data/corner-cases');

console.log("\n\nJSON:");
console.log(JSON.stringify(obj, null, ' '));

//obj.circular.deeper.still_deeper.obj = obj;

console.log("\n\nINSPECT:");
console.log(util.inspect(obj, false, 1, true));
/*

console.log("\n\nINSPECT2:");
console.log(util2.format(obj));
*/
console.log("\n\nINSPECT2(dense):");

var FormatterJson = Formatter.withConfig({
  color: false,
  wrapWidth: 100,
  quoteKeys: true,
  quotes: '"'
});
var FormatterPretty = Formatter.withConfig({
  color: true,
  wrapWidth: 100,
  quoteKeys: false,
  quotes: '"',
  showHidden: true,
  showAccessors: true,
  jsonParity: false,
  complexObjects: true
})
console.log(FormatterPretty(obj));

