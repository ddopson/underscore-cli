
### V.next?

* more awesome stuff? - maybe ...

### 0.2.16 (2012-11-05)

* make {coffee-script, JSONSelect, msgpack} 'optional' dependencies, so install doesn't break if they fail (eg win32 msgpack)

### 0.2.15 (2012-11-05)

* bugfix: 'console' was not being exposed to all user expressions

### 0.2.14 (2012-10-22)

* bugfix: newer versions of commander.js would fail to correctly print help menu

### 0.2.13 (2012-09-18)

* Feature: MessagePack input/output support
* Perf: reduce init time further to 85 ms
* bugfix: extraneous logging was breaking coffeescript chaining
* bugfix: require should work inside expressions. and should respect process.cwd

### 0.2.12 (2012-08-27)

* Perf: reduce total init time from 153 ms to 93 ms
* add the --trace CLI param

### 0.2.11 (2012-07-29)

* add the --color CLI param

### 0.2.10 (2012-07-15)

* ground-up rewrite of Formatter code for optimal "strict + pretty + semi-dense" JSON output

### 0.2.9 (2012-05-07)

* autodetect CoffeeScript expressions

### 0.2.8 (2012-05-03)

* allow use of semicolons in expressions
* packaging bugfixes
* better documentation

### 0.2.6 (2012-05-01)

* CoffeeScript support
* Compile templates as first-class Node modules (gives us error messages with accuate line numbers)
* Expressions autoreturn the last value
