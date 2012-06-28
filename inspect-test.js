#!/usr/bin/env node

var util = require('util');
var Formatter = require('./lib/formatter');

var obj = {
  num: 9,
  
  str1: 'Hello World',
  str2: (v='mystring', v.prop1=8, v[3]=43, v),

  o1: {},
  o2: (v={a: 9}, v[3]=4, v),

  date: new Date(),
  date2: (v=new Date(), v.prop1=8, v.prop2=9, v),

  error: new Error('my err msg'),
  error2: (v=new Error('my err msg'), v.prop1=8, v.prop2=9, v),

  fn1: function () { },
  fn2: function fn_name () { },
  fn3: (v=function hi(a,b,c){return 4;}, v.prop1=1, v.prop2=2, v),

  re1: /^78/,
  re2: (v=/^78/,v.bar=2,v),

  nll: null,

  ar1: [1, 2, 3, 4],
  ar2: (v=[1, 2, 3, 4], v.bar=33, v[6]=8,v),

  longstr: 'aoseuthaoesnuhaosenthuasoenthuasoenthuasoenthuasoenthuasnoethuasnoethuasonethuasnoethusanoethiasnoethuasonethuasoenhuasnoethuasnoethuasonethusanoethusnaoethuasnoethuiasnoeidaosneutdhaoesntuhaoesnthuasonehuasnoethuaosentuhasoenthuaosnethuasoenthuasoenthuasoentuhasnoethuasnoehuasnoethuasnoethuasonethuasnotehuasnotehuasnoethuasonethuasoentuhaoseu',
  deep: {a: {b: {c: {}}}},

  circular: { deeper: { still_deeper: {}}},
};


console.log("\n\nJSON:");
console.log(JSON.stringify(obj, null, ' '));

//obj.circular.deeper.still_deeper.obj = obj;

/*console.log("\n\nINSPECT:");
console.log(util.inspect(obj, false, 1, true));

console.log("\n\nINSPECT2:");
console.log(util2.format(obj));
*/
console.log("\n\nINSPECT2(dense):");

var FormatterJson = Formatter.withConfig({color: false, wrapWidth: 100, quoteKeys: true, quotes: '"'})
var FormatterPretty = Formatter.withConfig({color: true, wrapWidth: 100, quoteKeys: false, quotes: "'"})
console.log(FormatterPretty(obj));

