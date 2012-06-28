### type
<pre><code>underscore type --data '[]'
# "array"

underscore type --data '{}'
# "object"

underscore type --data 99
# "number"

underscore type --data '99'
# "number"

underscore type --data '"99"'
# "string"

underscore type --data 'false'
# "boolean"

underscore type --data 'null'
# "null"

underscore type --data 'undefined'
# "undefined"

underscore type --nodata
# "undefined"

</code></pre>
### print
<pre><code>underscore print --data '[1, 2, 3, 4]'
# [1, 2, 3, 4]

cat example-data/simple.json | underscore print
# { "foo": "bar", "baz": [1, 2, 3] }

echo 'this is a sentence' | underscore print --text
# this is a sentence

</code></pre>
### run
<pre><code>underscore run 'print("myString")'
# myString

</code></pre>
### process
<pre><code>underscore process --data '"my-string"' 'camelize(data)'
# "myString"

underscore process --data '[1, 2, 3, 4]' 'max(data)'
# 4

</code></pre>
### extract
<pre><code>underscore extract field1.field2.field3 --data '{field1: {field2: { field3: 1234 }}}'
# 1234

</code></pre>
### map
<pre><code>underscore map --data '[1, 2, 3, 4]' 'value+1'
# [2, 3, 4, 5]

underscore map --data '{"a": 1, "b": 2}' 'key === "a" ? value+1 : value-1'
# [2, 1]

underscore map --data '{"a": [1, 4], "b": [2, 8]}' 'value[1]/value[0]'
# [4, 4]

underscore map --data '{"a": [1, 4], "b": [2, 8]}' 'max(value)'
# [4, 8]

</code></pre>
### reduce
<pre><code>underscore reduce --data '[1, 2, 3, 4]' 'total+value'
# 10

underscore reduce --data '[1, 2, 3, 4]' 'total+""+value'
# "1234"

underscore reduce --data '[1, 2, 3, 4]' 'total+""+value' 0
# "01234"

</code></pre>
### reduceRight
<pre><code>underscore reduceRight --data '[1, 2, 3, 4]' 'total+value'
# 10

underscore reduceRight --data '[1, 2, 3, 4]' 'total+""+value'
# "4321"

underscore reduceRight --data '[1, 2, 3, 4]' 'total+""+value' 0
# "04321"

underscore -i example-data/earthporn.json select '.children .title'
# [
#   "Eating breakfast in the Norwegian woods! Captured with my phone [2448x3264] ",
#   "The Rugged Beauty of Zion NP Utah at Sunrise [OC] (1924x2579)",
#   "Falls and island near Valdez, AK on a rainy day [4200 x 3000]",
#   "Havasu Falls, Havasupai, Arizona.  This is a personal photograph from a trip I took in 2006 before the flood of 2008 [960x1280]",
#   "Victoria Amazonica in Brazil, SC [2448X3264]",
#   "A dreamy haze flows over the Alaska Range on the Castner Glacier [4948 x 3280]"
# ]

</code></pre>
### find
<pre><code>underscore find --data '[1, 2, 3, 4]' 'value > 2'
# 3

underscore find --data '{"foo": 1, "bar": 2}' 'key == "bar"'
# 2

</code></pre>
### filter
<pre><code>underscore filter --data '[1, 2, 3, 4]' 'value > 2'
# [3, 4]

underscore filter --data '{"foo": 1, "bar": 2}' 'key == "bar"'
# [2]

</code></pre>
### reject
<pre><code>underscore reject --data '[1, 2, 3, 4]' 'value > 2'
# [1, 2]

underscore reject --data '{"foo": 1, "bar": 2}' 'key == "bar"'
# [1]

</code></pre>
### flatten
<pre><code>underscore flatten --data '[1, [2, [3]], 4]'
# [1, 2, 3, 4]

underscore flatten --shallow --data '[1, [2, [3]], 4]'
# [1, 2, [3], 4]

</code></pre>
### pluck
<pre><code>underscore pluck --data "[{name : 'moe', age : 40}, {name : 'larry', age : 50}, {name : 'curly', age : 60}]" name
# ["moe", "larry", "curly"]

</code></pre>
### keys
<pre><code>underscore keys --data '{name : "larry", age : 50}'
# ["name", "age"]

underscore keys --data '[8, 9, 10]'
# ["0", "1", "2"]

</code></pre>
### values
<pre><code>underscore values --data '{name : "larry", age : 50}'
# ["larry", 50]

underscore values --data '[8, 9, 10]'
# [8, 9, 10]

</code></pre>
### extend
<pre><code>underscore extend --data '{name : "larry", age : 50}' '{age: 65}'
# { "name": "larry", "age": 65 }

</code></pre>
### defaults
<pre><code>underscore defaults --data '{name : "larry", age : 50}' '{name: "unknown", salary: 100}'
# { "name": "larry", "age": 50, "salary": 100 }

</code></pre>
### any
<pre><code>underscore any --data '[1, 2, 3, 4]' 'value > 5'
# false

underscore any --data '[1, 2, 3, 4]' 'value > 2'
# true

underscore any --data '[1, 2, 3, 4]' 'value > 0'
# true

underscore any --data '{foo: 1, bar: 2}' 'key == "bar"'
# true

</code></pre>
### all
<pre><code>underscore all --data '[1, 2, 3, 4]' 'value > 5'
# false

underscore all --data '[1, 2, 3, 4]' 'value > 2'
# false

underscore all --data '[1, 2, 3, 4]' 'value > 0'
# true

underscore all --data '{"foo": 1, "bar": 2}' 'key == "bar"'
# false

</code></pre>
### isObject
<pre><code>underscore isObject --data '{name : "larry", age : 50}'
# true

underscore isObject --data '[]'
# false

underscore isObject --data '[]' --arrays-are-objects
# true

</code></pre>
### isArray
<pre><code>underscore isArray --data '{name : "larry", age : 50}'
# false

underscore isArray --data '[]'
# true

</code></pre>
### isString
<pre><code>underscore isString --data '{}'
# false

underscore isString --data '[]'
# false

underscore isString --data "'foo'"
# true

</code></pre>
### isNumber
<pre><code>underscore isNumber --data '{}'
# false

underscore isNumber --data '[]'
# false

underscore isNumber --data "'9'"
# false

underscore isNumber --data "9"
# true

</code></pre>
### isBoolean
<pre><code>underscore isBoolean --data '0'
# false

underscore isBoolean --data '1'
# false

underscore isBoolean --data 'true'
# true

underscore isBoolean --data 'false'
# true

</code></pre>
### isNull
<pre><code>underscore isNull --data '0'
# false

underscore isNull --data '1'
# false

underscore isNull --data 'false'
# false

underscore isNull --data 'null'
# true

underscore isNull --data 'undefined'
# false

</code></pre>
### isUndefined
<pre><code>underscore isUndefined --data '0'
# false

underscore isUndefined --data '1'
# false

underscore isUndefined --data 'false'
# false

underscore isUndefined --data 'null'
# false

underscore isUndefined --data 'undefined'
# true

</code></pre>
### template
<pre><code>underscore template --data '{name: "moe"}' example-data/trivial.template
# hello moe

underscore template --nodata example-data/trivial.template
# module.exports = function(obj){var __p='', print=function(){__p+=Array.prototype.join.call(arguments, '')};with(obj||{}){__p+='hello '+( name )+'\n'+
# '';} return __p; }
</code></pre>

