module.exports = { 
  // Numbers
  num: 9,
  
  // Strings
  str1: 'Hello World',
  str2: withProps('Hello World'),

  // Objects
  object0: {},
  object1: {'a': 1, 'b': 2}, 
  object2: withProps({'a': 1, 'b': 2}),

  // Arrays
  array0: [],
  array1: [1, 2, 3, 4],
  array2: [1, 2, null, undefined,, 6],
  array3: withProps([1, 2, 3, 4]),
  
  // Date Objects
  date1: new Date(1340920945993),
  date2: withProps(new Date(1340920945993)),

  // Error Objects
  err1: (new Error('my err msg')),
  err2: withProps(new Error('my err msg')),

  // RegExp Objects
  regex1: /^78/,
  regex2: withProps(/^78/),
  
  // Functions
  fn1: function () { },
  fn2: function fn_name (a, b, c) { return 4; },
  fn3: withProps(function fn_name(a,b,c){return 4;}),


  null1: null,
  undef1: undefined,


  deep: {a: {
    longstr: 'nuhaosenthuasoenthuasoenthuasoenthuasoenthuasnoethuasnoethuasonethuasnoethusanoethiasnoethuasonethuasoenhuasnoethuasnoethuasonethusanoethusnaoethuasnoethuiasnoeidaosneutdhaoesntuhaoesnthuasonehuasnoethuaosentuhasoenthuaosnethuasoenthuasoenthuasoentuhasnoethuasnoehuasnoethuasnoethuasonethuasnotehuasnotehuasnoethuasonetu',
    b: {c: {}}
  }},

};

function withProps(obj) {
  obj['3'] = 'three';
  obj['prop1'] = 1;
  obj['prop2'] = 2;
  obj[3] = 3;
  return obj;
}
