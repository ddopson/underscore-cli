# Overview

JSON is an excellent data interchange format and rapidly becoming the preferred format for Web APIs.
Thusfar, most of the tools to process it are very limited.  Yet, when working in Javascript, JSON is fluid and natural.  

<b>Why can't command-line Javascript be easy?</b>

Underscore-CLI can be a simple pretty printer:

    cat data.json | underscore print

Or it can form the backbone of a rich, full-powered Javascript command-line, inspired by "perl -pe", and doing for structured data what sed, awk, and grep do for text.
    
    cat example-data/earthporn.json | underscore extract 'data.children' | underscore pluck data | underscore pluck title

See [Real World Example] (#real_world_example) for the output and more examples.

### Underscore-CLI is:

 * **FLEXIBLE** - THE "swiss-army-knife" tool for processing JSON data - can be used as a simple pretty-printer, or as a full-powered Javascript command-line
 * **POWERFUL** - Exposes the full power and functionality of [underscore.js] (http://documentcloud.github.com/underscore/) (plus [underscore.string] (https://github.com/epeli/underscore.string))
 * **SIMPLE** - Makes it simple to write JS one-liners similar to using "perl -pe"
 * **CHAINED** - Multiple command invokations can be chained together to create a data processing pipeline
 * **MULTI-FORMAT** - Rich support for input / output formats - pretty-printing, strict JSON, etc.  See [Data Formats] (#data_formats)
 * **DOCUMENTED** - Excellent command-line documentation with multiple examples for every command

### A Bit More Explanation ...

Underscore-CLI is built on [Node.js](http://nodejs.org/#download), which is less than a 4M download and [very easy to install](#installing_node).  Node.js is rapidly gaining mindshare as a tool for writing scalable services in Javascript.

Unfortutately, out-of-the-box, Node.js is a pretty horrible as a command-line tool.  This is what it takes to simply echo stdin:

    cat foo.json | node -e '
      var data = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", function (d) {
        data = data + d;
      });
      process.stdin.on("end", function () {
        // put all your code here
        console.log(data);
      });
      process.stdin.resume();
    '

Ugly.  Underscore-CLI handles all the verbose boilerplate, making it easy to do simple data manipulations:

    echo '[1, 2, 3, 4]' | underscore process 'map(data, function (value) { return value+1 })'

If you are used to seeing "_.map", note that because we arn't worried about keeping the global namespace clean, [many useful functions](dead_link_for_now) (including all of underscore.js) are exposed as globals.

Of course 'mapping' a function to a dataset is super common, so as a shortcut, it's exposed as a first-class command, and the expression you provide is auto-wrapped in "function (value, key, list) { return ... }".

    echo '[1, 2, 3, 4]' | underscore map 'value+1'

Also, while you can pipe data in, if the data is just a string like the example above, there's a shortcut for that too:

    underscore -d '[1, 2, 3, 4]' map 'value+1'

Or if it's stored in a file, and you want to write the output to another file:

    underscore -i data.json map 'value+1' -o output.json

Here's what it takes to increment the minor version number for an NPM package (straight from our Makefile):

    underscore -i package.json process 'vv=data.version.split("."),vv[2]++,data.version=vv.join("."),data' -o package.json

# Installing Underscore-CLI

<a id="installing_node" name="installing_node"></a>
### Installing Node (command-line javascript)

Installing Node is easy.  It's only a 4M download:

[Download Node](http://nodejs.org/#download)

Alternatively, if you do [homebrew](http://mxcl.github.com/homebrew/), you can:

    brew install node

For more details on what node is, see [this StackOverflow thread](http://stackoverflow.com/questions/1884724/what-is-node-js/6782438#6782438)

### Installing 
    npm install -g underscore-cli
    underscore help

# Documentation

<a id="usage"/>
### Usage

If you run the tool without any arguments, this is what prints out:

  
    Usage: 
      underscore [undefined] [run] <command> [--in <filename>|--data <JSON>|--nodata] [--infmt <format>] [--out <filename>] [--outfmt <format>] [--quiet] [--strict] [--text] [--nowrap] [--coffee]
  
    
  
    Commands:
  
      help [command]      Print more detailed help and examples for a specific command
      type                Print the type of the input data: {object, array, number, string, boolean, null, undefined}
      print               Output the data without any transformations. Can be used to pretty-print JSON data.
      run <exp>           Runs arbitrary JS code. Use for CLI Javascripting.
      process <exp>       Run arbitrary JS against the input data.  Expression Args: (data)
      extract <field>     Extract a field from the input data.  Also supports field1.field2.field3
      map <exp>           Map each value from a list/object through a transformation expression whose arguments are (value, key, list).'
      reduce <exp>        Boil a list down to a single value by successively combining each element with a running total.  Expression args: (total, value, key, list)
      reduceRight <exp>   Right-associative version of reduce. ie, 1 + (2 + (3 + 4)). Expression args: (total, value, key, list)
      select <jselexp>    Run a 'JSON Selector' query against the input data. See jsonselect.org.
      find <exp>          Return the first value for which the expression Return a truish value.  Expression args: (value, key, list)
      filter <exp>        Return an array of all values that make the expression true.  Expression args: (value, key, list)
      reject <exp>        Return an array of all values that make the expression false.  Expression args: (value, key, list)
      flatten             Flattens a nested array (the nesting can be to any depth). If you pass '--shallow', the array will only be flattened a single level.
      pluck <key>         Extract a single property from a list of objects
      keys                Retrieve all the names of an object's properties.
      values              Retrieve all the values of an object's properties.
      extend <object>     Override properties in the input data.
      defaults <object>   Fill in missing properties in the input data.
      any <exp>           Return 'true' if any of the values in the input make the expression true.  Expression args: (value, key, list)
      all <exp>           Return 'true' if all values in the input make the expression true.  Expression args: (value, key, list)
      isObject            Return 'true' if the input data is an object with named properties
      isArray             Return 'true' if the input data is an array
      isString            Return 'true' if the input data is a string
      isNumber            Return 'true' if the input data is a number
      isBoolean           Return 'true' if the input data is a boolean, ie {true, false}
      isNull              Return 'true' if the input data is the 'null' value
      isUndefined         Return 'true' if the input data is undefined
      template <filename> Process an underscore template and print the results. See 'help template'
  
  
    Options:
  
      -h, --help            output usage information
      -V, --version         output the version number
      -i, --in <filename>   The data file to load.  If not specified, defaults to stdin.
      --infmt <format>      The format of the input data. See 'help formats'
      -o, --out <filename>  The output file.  If not specified, defaults to stdout.
      --outfmt <format>     The format of the output data. See 'help formats'
      -d, --data <JSON>     Input data provided in lieu of a filename
      -n, --nodata          Input data is 'undefined'
      -q, --quiet           Suppress normal output.  'console.log' will still trigger output.
      --strict              Use strict JSON parsing instead of more lax 'eval' syntax.  To avoid security concerns, use this with ANY data from an external source.
      --text                Parse data as text instead of JSON. Sets input and output formats to 'text'
      --nowrap              Instead of an expression like 'value+1', provide a full function body like 'return value+1;'.
      --coffee              Interpret expression as CoffeeScript. See http://coffeescript.org/
  
  
    Examples:
  
      underscore map --data '[1, 2, 3, 4]' 'value+1'
      # [
      #   2,
      #   3,
      #   4,
      #   5
      # ]
      
      underscore map --data '{"a": [1, 4], "b": [2, 8]}' '_.max(value)'
      # [
      #   4,
      #   8
      # ]
      
      echo '{"foo":1, "bar":2}' | underscore map -q 'console.log("key = ", key)'
      # "key = foo\nkey = bar"
      
      underscore pluck --data "[{name : 'moe', age : 40}, {name : 'larry', age : 50}, {name : 'curly', age : 60}]" name
      # [
      #   "moe",
      #   "larry",
      #   "curly"
      # ]
      
      underscore keys --data '{name : "larry", age : 50}'
      # [
      #   "name",
      #   "age"
      # ]
      
      underscore reduce --data '[1, 2, 3, 4]' 'total+value'
      # 10
      
  

<a id="data_formats"/>
### Data Formats


#### json

Output dense JSON

<pre><code>{"foo":"bar","baz":[1,2,3]}</code></pre>

#### json-pretty

Output JSON with whitespace (still strict JSON)

<pre><code>{
  "foo": "bar",
  "baz": [
    1,
    2,
    3
  ]
}</code></pre>

#### json-pretty2

Output JSON with whitespace and strip quotes off key names where possible

<pre><code>{
  foo: "bar",
  baz: [
    1,
    2,
    3
  ]
}</code></pre>

#### text

If data is a string, it is printed directly without quotes.  If data is an array, elements are separated by newlines.  Objects and arrays-within-arrays are JSON formated into a single line

<pre><code>{"foo":"bar","baz":[1,2,3]}</code></pre>

#### lax

Uses 'util.inspect' to print valid Javascript

<pre><code>{ foo: 'bar',
  baz: [ 1, 2, 3 ] }</code></pre>


<a id="real_world_example"/>
# Real World Example

Let's play with a real data source, like http://www.reddit.com/r/earthporn.json.  For convenience (and consistent test results), an abbreviated version of this data is stored in example-data/earthporn.json.  Let's say you want a list of all the image titles ...

Using JSONSelect, this is trivial:

    cat example-data/earthporn.json | underscore select '.data .title'
 
Alternatively, you could do it the traditional way:

    cat example-data/earthporn.json | underscore extract 'data.children' | underscore pluck data | underscore pluck title

Which prints:

    [ 'Fjaðrárgljúfur canyon, Iceland [OC] [683x1024]',
      'New town, Edinburgh, Scotland [4320 x 3240]',
      'Sunrise in Bryce Canyon, UT [1120x700] [OC]',
      'Kariega Game Reserve, South Africa [3584x2688]',
      'Valle de la Luna, Chile [OS] [1024x683]',
      'Frosted trees after a snowstorm in Laax, Switzerland [OC] [1072x712]' ]


Hmm, I think I'd like code-worthy names for those images.

Underscore-CLI exposes the function from [underscore.js] (http://documentcloud.github.com/underscore/) and [underscore.string] (https://github.com/epeli/underscore.string)) not only as first-class commands, but also within command-line Javascript expressions:

    cat earthporn.json | underscore select '.data .title' | underscore map 'camelize(value.replace(/\[.*\]/g,"")).replace(/[^a-zA-Z]/g,"")'
 
Which prints ...

    [ 'FjarrgljfurCanyonIceland',
      'NewTownEdinburghScotland',
      'SunriseInBryceCanyonUT',
      'KariegaGameReserveSouthAfrica',
      'ValleDeLaLunaChile',
      'FrostedTreesAfterASnowstormInLaaxSwitzerland' ]

Try doing THAT with any other one-liner!

Look at [Examples.md](https://github.com/ddopson/underscore-cli/blob/master/Examples.md) for a more comprehensive list of examples.

# Alternatives

* [jsonpipe] (https://github.com/dvxhouse/jsonpipe) - Python focused, w/ a featureset centered around a single scenario
* [jshon] (http://kmkeen.com/jshon/) - Has a lot of functions, but very terse
* [json-command] (https://github.com/zpoley/json-command) - very limited
* [TickTick] (https://github.com/kristopolous/TickTick) - Bash focused JSON manipulation.  Iteresting w/ heavy Bash integration. Complements this tool.
* [json] (https://github.com/trentm/json) - Similar idea.
* [jsawk] (https://github.com/micha/jsawk) - Similar idea. Uses a custom JS environment. Good technical documentation.
* [jsonpath] (http://code.google.com/p/jsonpath/wiki/Javascript) - this is not a CLI tool.  It's a runtime JS library.
* [json:select()] (http://jsonselect.org/#tryit) - this is not a CLI tool.  CSS-like selectors for JSON.  <strike>Very interesting idea that I might add as annother command to Underscore-CLI</strike>

Please add a Github issue if I've missed any.

