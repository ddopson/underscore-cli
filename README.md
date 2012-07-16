# Overview
<pre>
:::python
"3": <span style="color:yellow">3</span>,
"a": <span style="color:yellow">1</span>,
<font color="green">"b": <span style="color:yellow">2</span>,</font>
"prop1": <span style="color:yellow">1</span>,
"prop2": <span style="color:yellow">2</span>
</pre>
JSON is an excellent data interchange format and rapidly becoming the preferred format for Web APIs.
Thusfar, most of the tools to process it are very limited.  Yet, when working in Javascript, JSON is fluid and natural.  

<b>Why can't command-line Javascript / JSON be easy?</b>

Underscore-CLI can be a simple pretty printer:

    cat data.json | underscore print

Or it can form the backbone of a rich, full-powered Javascript command-line, inspired by "perl -pe", and doing for structured data what sed, awk, and grep do for text.
    
    curl -s http://www.reddit.com/r/earthporn.json | underscore extract 'data.children' | underscore pluck data | underscore pluck title

See [Real World Example] (#real_world_example) for the output and a few other variants.  

### Features

 * **FLEXIBLE** - THE "swiss-army-knife" tool for processing JSON data - can be used as a simple pretty-printer, or as a full-powered Javascript command-line
 * **POWERFUL** - Exposes the full power and functionality of [underscore.js] (http://documentcloud.github.com/underscore/) (plus [underscore.string] (https://github.com/epeli/underscore.string))
 * **SIMPLE** - Makes it simple to write JS one-liners similar to using "perl -pe"
 * **CHAINED** - Multiple command invokations can be chained together to create a data processing pipeline
 * **MULTI-FORMAT** - Rich support for input / output formats - pretty-printing, strict JSON, etc [coming soon]
 * **DOCUMENTED** - Excellent command-line documentation with multiple examples for every command

### Installing Underscore-CLI

If you don't yet have [Node](http://nodejs.org/#download), see [Installing Node](#installing_node).

    npm install -g underscore-cli
    underscore help

### Usage

If you run the tool without any arguments, this is what prints out:

  
    Usage: underscore [undefined] [process] <command> [--in <filename>|--data <JSON>|--nodata] [--infmt <format>] [--out <filename>] [--outfmt <format>] [--quiet] [--strict] [--nowrap]
  
  
    
    Commands:
  
  
       help [command]      Print more detailed help and examples for a specific command
       examples            Print an exhaustive list of ALL examples
       type                Print the type of the input data: {object, array, number, string, boolean, null, undefined}
       print               Output the data without any transformations. Can be used to pretty-print JSON data.
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
      --nowrap              Instead of an expression like 'value+1', provide a full function body like 'return value+1;'.
  
  
    Examples:
  
  
      underscore map --data '[1, 2, 3, 4]' 'value+1'
      # [ 2, 3, 4, 5 ]
      
      underscore map --data '{"a": [1, 4], "b": [2, 8]}' '_.max(value)'
      # [ 4, 8 ]
      
      echo '{"foo":1, "bar":2}' | underscore map -q 'console.log("key = ", key)'
      # 'key = foo\nkey = bar'
      
      underscore pluck --data "[{name : 'moe', age : 40}, {name : 'larry', age : 50}, {name : 'curly', age : 60}]" name
      # [ 'moe', 'larry', 'curly' ]
      
      underscore keys --data '{name : "larry", age : 50}'
      # [ 'name', 'age' ]
      
      underscore reduce --data '[1, 2, 3, 4]' 'total+value'
      # 10
      

# Real World Example
<a id="real_world_example" name="real_world_example"></a>

    curl -s http://www.reddit.com/r/earthporn.json | underscore extract 'data.children' | underscore pluck data | underscore pluck title

Which prints (truncated for brevity. the actual list has 25 entries):

    [ 'Fjaðrárgljúfur canyon, Iceland [OC] [683x1024]',
      'New town, Edinburgh, Scotland [4320 x 3240]',
      'Sunrise in Bryce Canyon, UT [1120x700] [OC]',
      'Kariega Game Reserve, South Africa [3584x2688]',
      'Valle de la Luna, Chile [OS] [1024x683]',
      'Frosted trees after a snowstorm in Laax, Switzerland [OC] [1072x712]' ]

How many entries was that again?:

    curl -s http://www.reddit.com/r/earthporn.json | underscore extract 'data.children' | underscore pluck data | underscore pluck title | underscore process 'data.length'

Oh yeah, there were:

    25

Doing the same thing with 'select' ([jsonselect.org](http://jsonselect.org)):

    cat earthporn.json | underscore select '.data .title'

Hmm, I think I'd like code-worthy names for those images.

Good thing Underscore-CLI exposes the full capabilities of [underscore.js] (http://documentcloud.github.com/underscore/) and (plus [underscore.string] (https://github.com/epeli/underscore.string)) not only as first-class commands, but also within command-line Javascript expressions:

    cat earthporn.json | underscore select '.data .title' | underscore map '_.camelize(value.replace(/\[.*\]/g,"")).replace(/[^a-zA-Z]/g,"")'
 
Which prints ...

    [ 'FjarrgljfurCanyonIceland',
      'NewTownEdinburghScotland',
      'SunriseInBryceCanyonUT',
      'KariegaGameReserveSouthAfrica',
      'ValleDeLaLunaChile',
      'FrostedTreesAfterASnowstormInLaaxSwitzerland' ]

Try doing THAT with any other one-liner!


# Installing Node (command-line javascript)
<a id="installing_node" name="installing_node"></a>

This tool makes heavy use of Javascript.  Node is very easy to install and rapidly becoming _the_ way to run javascript from the command-line: [Download Node](http://nodejs.org/#download)

Alternatively, if you do [homebrew](http://mxcl.github.com/homebrew/), you can:

    brew install node

For more details on what node is, see [this StackOverflow thread](http://stackoverflow.com/questions/1884724/what-is-node-js/6782438#6782438)

# Alternatives

* [jsonpipe] (https://github.com/dvxhouse/jsonpipe) - Python focused, w/ a featureset centered around a single scenario
* [jshon] (http://kmkeen.com/jshon/) - Has a lot of functions, but very terse
* [json-command] (https://github.com/zpoley/json-command) - very limited
* [TickTick] (https://github.com/kristopolous/TickTick) - Bash focused JSON manipulation.  Iteresting w/ heavy Bash integration. Complements this tool.
* [json] (https://github.com/trentm/json) - Similar idea.
* [jsawk] (https://github.com/micha/jsawk) - Similar idea. Uses a custom JS environment. Good technical documentation.
* [jsonpath] (http://code.google.com/p/jsonpath/wiki/Javascript) - this is not a CLI tool.  It's a runtime JS library.
* [json:select()] (http://jsonselect.org/#tryit) - this is not a CLI tool.  CSS-like selectors for JSON.  Very interesting idea that I might add as annother command to Underscore-CLI

Please add a Github issue if I've missed any.


