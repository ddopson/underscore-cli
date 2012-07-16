module.exports = { 
  // Numbers
  num1: 9,
  num2: withProps(9),
  num3: withProps(new Number(9)),

  bool1: true,
  bool2: withProps(true),
  bool2b: withProps(Boolean(true)),
  bool3: withProps(new Boolean(true)),
  
  // Strings
  str1: 'Hello World',
  str2: withProps('Hello World'), // this doesn't work! the string is immutable and props don't get set
  str3: withProps(new String('Hello World')),  // this one actually sets properties

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
  fn4: withProps(new Function(['a', 'b', 'c'], 'return a+b+c')),

  null1: null,
  undef1: undefined,

  deep: {a: [ {
    longstr: 'This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!',
    b: {c: {}}
  }]
  , g: {
    longstr: 'This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!',
  }},

};

function withProps(obj) {
  obj['3'] = 'three';
  obj[3] = 'z';
  obj['prop1'] = 1;
  obj['prop2'] = 2;
  obj[13] = 3;
  return obj;
}
