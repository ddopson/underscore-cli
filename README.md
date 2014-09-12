# Overview

JSON is an excellent data interchange format and rapidly becoming the preferred format for Web APIs.
Thusfar, most of the tools to process it are very limited.  Yet, when working in Javascript, JSON is fluid and natural.

<b>Why can't command-line Javascript be easy?</b>

Underscore-CLI can be a simple pretty printer:

    cat data.json | underscore print --color

![example.png](https://raw.github.com/ddopson/underscore-cli/master/doc/example.png)

Or it can form the backbone of a rich, full-powered Javascript command-line, inspired by "perl -pe", and doing for structured data what sed, awk, and grep do for text.

    cat example-data/earthporn.json | underscore extract 'data.children' | underscore pluck data | underscore pluck title

See [Real World Example] (#real_world_example) for the output and more examples.

### Underscore-CLI is:

 * **FLEXIBLE** - THE "swiss-army-knife" tool for processing JSON data - can be used as a simple pretty-printer, or as a full-powered Javascript command-line
 * **POWERFUL** - Exposes the full power and functionality of [underscore.js] (http://documentcloud.github.com/underscore/) (plus [underscore.string] (https://github.com/epeli/underscore.string), [json:select](http://jsonselect.org/#overview), and [CoffeeScript](http://coffeescript.org/))
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






<a name="installing" />
# Installing Underscore-CLI

<a name="installing_node"></a>
### Installing Node (command-line javascript)

Installing Node is easy.  It's only a 4M download:

[Download Node](http://nodejs.org/#download)

Alternatively, if you do [homebrew](http://mxcl.github.com/homebrew/), you can:

    brew install node

For more details on what node is, see [this StackOverflow thread](http://stackoverflow.com/questions/1884724/what-is-node-js/6782438#6782438)

### Installing
    npm install -g underscore-cli
    underscore help









<a name="documentation" />
# Documentation

<a name="usage"/>
### Usage

If you run the tool without any arguments, this is what prints out:

  
    Usage: 
      underscore <command> [--in <filename>|--data <JSON>|--nodata] [--infmt <format>] [--out <filename>] [--outfmt <format>] [--quiet] [--strict] [--color] [--text] [--trace] [--coffee] [--js]
  
    
  
    Commands:
  
      help [command]      Print more detailed help and examples for a specific command
      type                Print the type of the input data: {object, array, number, string, boolean, null, undefined}
      print               Output the data without any transformations. Can be used to pretty-print JSON data.
      pretty              Output the data without any transformations. Can be used to pretty-print JSON data. (defaults output format to 'pretty')
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
      --color               Colorize output
      --text                Parse data as text instead of JSON. Sets input and output formats to 'text'
      --trace               Print stack traces when things go wrong
      --coffee              Interpret expression as CoffeeScript. See http://coffeescript.org/
      --js                  Interpret expression as JavaScript. (default is "auto")
  
  
    Examples:
  
      underscore map --data '[1, 2, 3, 4]' 'value+1'
      # [2, 3, 4, 5]
      
      underscore map --data '{"a": [1, 4], "b": [2, 8]}' '_.max(value)'
      # [4, 8]
      
      echo '{"foo":1, "bar":2}' | underscore map -q 'console.log("key = ", key)'
      # "key = foo\nkey = bar"
      
      underscore pluck --data "[{name : 'moe', age : 40}, {name : 'larry', age : 50}, {name : 'curly', age : 60}]" name
      # ["moe", "larry", "curly"]
      
      underscore keys --data '{name : "larry", age : 50}'
      # ["name", "age"]
      
      underscore reduce --data '[1, 2, 3, 4]' 'total+value'
      # 10
      
  

<a name="data_formats"/>
### Data Formats


#### json

The default format.  Outputs strictly correct, human-readible JSON w/ smart whitespace. This format has received a lot of love.  Try the '--color' flag.


<pre><code>{
  "num": 9,
  "bool": true,
  "str1": "Hello World",
  "object0": { },
  "object1": { "a": 1, "b": 2 },
  "array0": [ ],
  "array1": [1, 2, 3, 4],
  "array2": [1, 2, null, null, null, 6],
  "date1": "2012-06-28T22:02:25.993Z",
  "date2": "2012-06-28T22:02:25.993Z",
  "err1": { },
  "err2": { "3": "three", "prop1": 1, "prop2": 2 },
  "regex1": { },
  "regex2": { "3": "three", "prop1": 1, "prop2": 2 },
  "null1": null,
  "deep": {
    "a": [
      {
        "longstr": "This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!",
        "b": { "c": { } }
      }
    ],
    "g": {
      "longstr": "This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!"
    }
  }
}</code></pre>

#### dense

Output dense JSON using JSON.stringify.  Efficient, but hard to read.


<pre><code>{"num":9,"bool":true,"str1":"Hello World","object0":{},"object1":{"a":1,"b":2},"array0":[],"array1":[1,2,3,4],"array2":[1,2,null,null,null,6],"date1":"2012-06-28T22:02:25.993Z","date2":"2012-06-28T22:02:25.993Z","err1":{},"err2":{"3":"three","prop1":1,"prop2":2},"regex1":{},"regex2":{"3":"three","prop1":1,"prop2":2},"null1":null,"deep":{"a":[{"longstr":"This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!","b":{"c":{}}}],"g":{"longstr":"This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!"}}}</code></pre>

#### stringify

Output formatted JSON using JSON.stringify.  A bit too verbose.


<pre><code>{
  "num": 9,
  "bool": true,
  "str1": "Hello World",
  "object0": {},
  "object1": {
    "a": 1,
    "b": 2
  },
  "array0": [],
  "array1": [
    1,
    2,
    3,
    4
  ],
  "array2": [
    1,
    2,
    null,
    null,
    null,
    6
  ],
  "date1": "2012-06-28T22:02:25.993Z",
  "date2": "2012-06-28T22:02:25.993Z",
  "err1": {},
  "err2": {
    "3": "three",
    "prop1": 1,
    "prop2": 2
  },
  "regex1": {},
  "regex2": {
    "3": "three",
    "prop1": 1,
    "prop2": 2
  },
  "null1": null,
  "deep": {
    "a": [
      {
        "longstr": "This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!",
        "b": {
          "c": {}
        }
      }
    ],
    "g": {
      "longstr": "This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!"
    }
  }
}</code></pre>

#### pretty

Output a richer 'inspection' syntax.  When printing array-and-object graphs that can be generated by JSON.parse, the output is valid JavaScript syntax (but not strict JSON).  When handling complex objects not expressable in declarative JavaScript (eg arrays that also have object properties), the output is informative, but not parseable as JavaScript.


<pre><code>{
  num: 9,
  bool: true,
  str1: "Hello World",
  object0: { },
  object1: { a: 1, b: 2 },
  array0: [ ],
  array1: [1, 2, 3, 4],
  array2: [1, 2, null, undefined, , 6],
  date1: 2012-06-28T22:02:25.993Z,
  date2: 2012-06-28T22:02:25.993Z{ "3": "three", prop1: 1, prop2: 2 },
  err1: [Error: my err msg],
  err2: [Error: my err msg]{ "3": "three", prop1: 1, prop2: 2 },
  regex1: /^78/,
  regex2: /^78/{ "3": "three", prop1: 1, prop2: 2 },
  fn1: [Function],
  fn2: [Function: fn_name],
  fn3: [Function: fn_name],
  fn4: [Function],
  null1: null,
  undef1: undefined,
  deep: {
    a: [
      {
        longstr: "This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!",
        b: { c: { } }
      }
    ],
    g: {
      longstr: "This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!"
    }
  }
}</code></pre>

#### inspect

Uses Node's 'util.inspect' to print the output


<pre><code>{ num: 9,
  bool: true,
  str1: 'Hello World',
  object0: {},
  object1: { a: 1, b: 2 },
  array0: [],
  array1: [ 1, 2, 3, 4 ],
  array2: [ 1, 2, null, undefined, , 6 ],
  date1: Thu Jun 28 2012 15:02:25 GMT-0700 (PDT),
  date2: { Thu, 28 Jun 2012 22:02:25 GMT '3': 'three', prop1: 1, prop2: 2 },
  err1: [Error: my err msg],
  err2: { [Error: my err msg] '3': 'three', prop1: 1, prop2: 2 },
  regex1: /^78/,
  regex2: { /^78/ '3': 'three', prop1: 1, prop2: 2 },
  fn1: [Function],
  fn2: [Function: fn_name],
  fn3: { [Function: fn_name] '3': 'three', prop1: 1, prop2: 2 },
  fn4: { [Function] '3': 'three', prop1: 1, prop2: 2 },
  null1: null,
  undef1: undefined,
  deep: 
   { a: 
      [ { longstr: 'This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!',
          b: { c: {} } } ],
     g: { longstr: 'This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!' } } }</code></pre>

#### text

If data is a string, it is printed directly without quotes.  If data is an array, elements are separated by newlines.  Objects and arrays-within-arrays are JSON formated into a single line.  The stock example does not convey the intent of this format, which is designed to enable traditional text processing via JavaScript and to facilitate flattening of JSON lists into line-delimited lists.


#### msgpack

MessagePack binary JSON format


<pre><code>&#222;&#0;&#21;&#163;num&#9;&#164;bool&#195;&#164;str1&#171;Hello World&#167;object0&#128;&#167;object1&#130;&#161;a&#1;&#161;b&#2;&#166;array0&#144;&#166;array1&#148;&#1;&#2;&#3;&#4;&#166;array2&#150;&#1;&#2;&#192;&#192;&#192;&#6;&#165;date1&#184;2012-06-28T22:02:25.993Z&#165;date2&#184;2012-06-28T22:02:25.993Z&#164;err1&#128;&#164;err2&#131;&#3;&#165;three&#165;prop1&#1;&#165;prop2&#2;&#166;regex1&#128;&#166;regex2&#131;&#3;&#165;three&#165;prop1&#1;&#165;prop2&#2;&#163;fn1&#128;&#163;fn2&#128;&#163;fn3&#131;&#3;&#165;three&#165;prop1&#1;&#165;prop2&#2;&#163;fn4&#131;&#3;&#165;three&#165;prop1&#1;&#165;prop2&#2;&#165;null1&#192;&#166;undef1&#192;&#164;deep&#130;&#161;a&#145;&#130;&#167;longstr&#218;&#0;&#143;This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!&#161;b&#129;&#161;c&#128;&#161;g&#129;&#167;longstr&#218;&#0;&#143;This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!</code></pre>

#### msgpack.print

Textual representation of MessagePack


<pre><code>&#60;de&#62;&#60;00&#62;&#60;15&#62;&#60;a3&#62;num&#60;09&#62;&#60;a4&#62;bool&#60;c3&#62;&#60;a4&#62;str1&#60;ab&#62;Hello World&#60;a7&#62;object0&#60;80&#62;&#60;a7&#62;object1&#60;82&#62;&#60;a1&#62;a&#60;01&#62;&#60;a1&#62;b&#60;02&#62;&#60;a6&#62;array0&#60;90&#62;&#60;a6&#62;array1&#60;94&#62;&#60;01&#62;&#60;02&#62;&#60;03&#62;&#60;04&#62;&#60;a6&#62;array2&#60;96&#62;&#60;01&#62;&#60;02&#62;&#60;c0&#62;&#60;c0&#62;&#60;c0&#62;&#60;06&#62;&#60;a5&#62;date1&#60;b8&#62;2012-06-28T22:02:25.993Z&#60;a5&#62;date2&#60;b8&#62;2012-06-28T22:02:25.993Z&#60;a4&#62;err1&#60;80&#62;&#60;a4&#62;err2&#60;83&#62;&#60;03&#62;&#60;a5&#62;three&#60;a5&#62;prop1&#60;01&#62;&#60;a5&#62;prop2&#60;02&#62;&#60;a6&#62;regex1&#60;80&#62;&#60;a6&#62;regex2&#60;83&#62;&#60;03&#62;&#60;a5&#62;three&#60;a5&#62;prop1&#60;01&#62;&#60;a5&#62;prop2&#60;02&#62;&#60;a3&#62;fn1&#60;80&#62;&#60;a3&#62;fn2&#60;80&#62;&#60;a3&#62;fn3&#60;83&#62;&#60;03&#62;&#60;a5&#62;three&#60;a5&#62;prop1&#60;01&#62;&#60;a5&#62;prop2&#60;02&#62;&#60;a3&#62;fn4&#60;83&#62;&#60;03&#62;&#60;a5&#62;three&#60;a5&#62;prop1&#60;01&#62;&#60;a5&#62;prop2&#60;02&#62;&#60;a5&#62;null1&#60;c0&#62;&#60;a6&#62;undef1&#60;c0&#62;&#60;a4&#62;deep&#60;82&#62;&#60;a1&#62;a&#60;91&#62;&#60;82&#62;&#60;a7&#62;longstr&#60;da&#62;&#60;00&#62;&#60;8f&#62;This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!&#60;a1&#62;b&#60;81&#62;&#60;a1&#62;c&#60;80&#62;&#60;a1&#62;g&#60;81&#62;&#60;a7&#62;longstr&#60;da&#62;&#60;00&#62;&#60;8f&#62;This really long string will force the object containing it to line-wrap.  Underscore-cli is smart about whitespace and only wraps when needed!</code></pre>









<a name="real_world_example"/>
# Real World Examples

### Playing with data from a webservice

Let's play with a real data source, like http://www.reddit.com/r/earthporn.json.  For convenience (and consistent test results), an abbreviated version of this data is stored in example-data/earthporn.json.

First of all, note how raw unformatted JSON is really hard to parse with your eyes ...

    {"kind":"Listing","data":{"modhash":"","children":[{"kind":"t3","data":{"domain":"i.imgur.com","banned_by":null,"media_e
    mbed":{},"subreddit":"EarthPorn","selftext_html":null,"selftext":"","likes":null,"saved":false,"id":"rwoa4","clicked":fa
    lse,"title":"Eating breakfast in the Norwegian woods! Captured with my phone [2448x3264] ","num_comments":70,"score":960
    ,"approved_by":null,"over_18":false,"hidden":false,"thumbnail":"http://b.thumbs.redditmedia.com/mytr7zvc0zZdPVV7.jpg","s
    ubreddit_id":"t5_2sbq3","author_flair_css_class":null,"downs":352,"is_self":false,"permalink":"/r/EarthPorn/comments/rwo
    a4/eating_breakfast_in_the_norwegian_woods_captured/","name":"t3_rwoa4","created":1333763527,"url":"http://i.imgur.com/R
    hBFe.jpg","author_flair_text":null,"author":"pansermannen","created_utc":1333738327,"media":null,"num_reports":null,"ups
    ":1312}},{"kind":"t3","data":{"domain":"imgur.com","banned_by":null,"media_embed":{},"subreddit":"EarthPorn","selftext_h
    tml":null,"selftext":"","likes":null,"saved":false,"id":"rwgmb","clicked":false,"title":"The Rugged Beauty of Zion NP Ut
    ah at Sunrise [OC] (1924x2579)","num_comments":5,"score":72,"approved_by":null,"over_18":false,"hidden":false,"thumbnail
    ":"http://f.thumbs.redditmedia.com/0v2GKlqrj35YUaVw.jpg","subreddit_id":"t5_2sbq3","author_flair_css_class":null,"downs"
    :20,"is_self":false,"permalink":"/r/EarthPorn/comments/rwgmb/the_rugged_beauty_of_zion_np_utah_at_sunrise_oc/","name":"t
    3_rwgmb","created":1333755348,"url":"http://imgur.com/veRJD","author_flair_text":null,"author":"TeamLaws","created_utc":
    1333730148,"media":null,"num_reports":null,"ups":92}},{"kind":"t3","data":{"domain":"flickr.com","banned_by":null,"media
    _embed":{},"subreddit":"EarthPorn","selftext_html":null,"selftext":"","likes":null,"saved":false,"id":"rvuiu","clicked":
    false,"title":"Falls and island near Valdez, AK on a rainy day [4200 x 3000]","num_comments":10,"score":573,"approved_by

As I've already mentioned, it would be trivial to pretty print the data with 'underscore print'.  However, if we are just trying to get a sense of the structure of the data, we can do one better:

    TODO: working on a 'summarize' command -- INSERT_THAT_HERE (2012-05-04)

Now, let's say that we want a list of all the image titles; using a [json:select](http://jsonselect.org#overview) query, this is downright trivial:

    cat example-data/earthporn.json | underscore select .title

Which prints:

    [ 'Fjaðrárgljúfur canyon, Iceland [OC] [683x1024]',
      'New town, Edinburgh, Scotland [4320 x 3240]',
      'Sunrise in Bryce Canyon, UT [1120x700] [OC]',
      'Kariega Game Reserve, South Africa [3584x2688]',
      'Valle de la Luna, Chile [OS] [1024x683]',
      'Frosted trees after a snowstorm in Laax, Switzerland [OC] [1072x712]' ]

If we want to grep the results, 'text' is a better format choice:

    cat example-data/earthporn.json | underscore select .title --outfmt text

    Fjaðrárgljúfur canyon, Iceland [OC] [683x1024]
    New town, Edinburgh, Scotland [4320 x 3240]
    Sunrise in Bryce Canyon, UT [1120x700] [OC]
    Kariega Game Reserve, South Africa [3584x2688]
    Valle de la Luna, Chile [OS] [1024x683]
    Frosted trees after a snowstorm in Laax, Switzerland [OC] [1072x712]

Let's create code-style names for those images using the 'camelize' function from [underscore.string] (https://github.com/epeli/underscore.string).

    cat earthporn.json | underscore select '.data .title' | underscore map 'camelize(value.replace(/\[.*\]/g,"")).replace(/[^a-zA-Z]/g,"")' --outfmt text

Which prints ...

    FjarrgljfurCanyonIceland
    NewTownEdinburghScotland
    SunriseInBryceCanyonUT
    KariegaGameReserveSouthAfrica
    ValleDeLaLunaChile
    FrostedTreesAfterASnowstormInLaaxSwitzerland

Try doing THAT with any other CLI one-liner!

### Version-bump in package.json

This one is straight out of our own [Makefile](https://github.com/ddopson/underscore-cli/blob/master/Makefile):

    underscore -i package.json process 'vv=data.version.split("."); vv[2]++; data.version=vv.join("."); data;' -o package.json

### Getting a greppable list of URLs fetched during the load of a website

This is one I did at work the other day.  Chrome --> Dev Console (CMD-OPT-J) --> Network Tab --> (right click context menu) --> Save All as HAR.  I have no idea why it's called a "HAR" file, but it's pure JSON data ... pretty verbose stuff, but I just want the urls ...

    cat site.har | underscore select '.url' --outfmt text | grep mydomain > urls.txt

Well, I'd also like to [ack](http://betterthangrep.com) through the contents of all those files.  Best to get a local snapshot of it all:

    cat urls.txt | while read line; do curl $line > $(echo $line | perl -pe 's/https?://([^?]*)[?]?.*/$1'); done

And I'm off to the races analyzing the behavior and load ordering of a complex production site that dynamically loads (literally) hundreds of individual resources off the network.  Sure, I could have viewed all that stuff inside Chrome, but I wanted a local directory-structured snapshot that I could serve on a local Nginx instance by adding entries in /etc/hosts that mapped the production domains to 127.0.0.1.  Now I can run the exact production site locally, make changes, and see what they would do.


Look at [Examples.md](https://github.com/ddopson/underscore-cli/blob/master/Examples.md) for a more comprehensive list of examples.











<a name="polish" />
# Polish: 1001 Little Conveniences

This section is intended to capture all the places where I spent a great deal of effort to get the best possible behavior on something subtle.  aka "polish".  It also captures some of the intended "best behaviors" that I haven't had cycles to implement yet.

### Templates as first class NPM modules - ie, real stack traces

When using the 'template' command, we go to great length to provide a fully debuggable experience.  We have a custom version of the template compilation code (templates are compiled to JS and then evaluated) that ensures a 1:1 mapping between line numbers in the original *.template file and line numbers in the generated JS code.  This code is then loaded as if it were a real Node.js module (literally, using a require() statement).  This means that should anything go wrong, the resulting stack traces and sytax exceptions will have correct line numbers from the original template file.

### Expressions auto-return the last value

This one is a bit [CoffeeScript](http://coffee-script.org) inspired.  When we parse command-line expressions for commands like 'map', they are evaluated as NodeScript objects.  This allows us to retrieve the last value in the expression.  In a previous version we wrapped expressions in function boilerplate; however this blocked the use of semicolons within an expression.  With first class Script objects, we can evaluate multiple semicolon delimited expressions and still capture the value from the last expression evaluated.  Thus, all of the following expressions will return "10".

    underscore run '5 + 5'
    underscore run 'x=5; y=5; x+y;'
    underscore run 'x=5, y=5, x+y;'

This even works to find the last evaluated value inside conditional branches (these also return 10):

    underscore run 'x=5; if (x > 0) { 10; } else { 0; }'           # last value is 10
    underscore run 'x=5; if (x > 0) { y=5; } else { y=-99; } x+y;' # last value is 'x+y'

In general, the principle here is that the code should just return what you intuitively expect without requiring much thought.

### Autodetection of CoffeeScript

If you type a CoffeeScript expression and forget to use the '--coffee' flag, Underscore-CLI will first attempt to parse it as JavaScript, and if that fails, parse it as CoffeeScript.

However, a warning is emitted:

    "Warning: Parsing user expression 'foo?.bar?.baz' as CoffeeScript.  Use '--coffee' to be more explicit."

Why do we print a warning?  Unfortunately, there are a number of language features that are ambiguous between JS and Coffee.  ie, expressions that are valid in both languages but with different meaning.  For example:

    test ? 10 : 20;  // JS: if test is true, then 10, else 20
    test ? 10 : 20;  // Coffee: if test is true, then test, else {10: 20}.  Tragic.

### Lazy loading of CoffeeScript/Msgpack/JSONSelect libraries

Loading the 'coffee-script' npm module takes 50+ ms.  JSONSelect is another 5ms.  That may not sound like much time, but it's the difference between 153 ms and 93 ms, and 153 ms is definitely human perceivable.  It will also make a difference if you are writing a quick-and-dirty bash loop that executes underscore-CLI repeatedly.  Plus, fast just feels good.

A few more notes... Node.js takes about 33 ms to run "hello world", and 45ms if you either "require('fs')" or 'require' anything that's not pre-compiled into the node executable (pretty hard to avoid that).  Adding underscore, underscore.string and a few of node's pre-compiled modules, and basic code loading takes ~60 ms.  That leaves ~33 ms spent on actually running code that initializes the command list and decides what to do with the command-line args that were passed in.

3rdly, as of v0.2.16, underscore-CLI now marks these packages as "optionalDependencies", meaning that on the minority of systems where there is an issues installing one of those packages (there was [a report](https://github.com/ddopson/underscore-cli/issues/12) of problems with msgpack), the overall underscore-CLI installation won't fail.

### Smart whitespace in output

As mentioned above, dense JSON is nearly unreadable to human beings, so we want to pretty print it.  JSON.stringify will accept an 'indentation' parameter that does make JSON much more readible; however, this will put _everything_ on a new line resulting in output that is silly verbose -- printing "[1, 2, 3, 4]" will take up 6 lines despite having only 12ish characters. Node's "util.inspect" is a bit better, but it doesn't print valid JSON (eg, inspect uses single instead of double quotes).  I don't want to compromize on JSON compatibility just to get pretty output.  So I wrote my own formatter that gives the best of both worlds.  The default output format is strictly JSON compatible, human readible, yet avoids excessive verbosity by putting small objects and arrays on a single line where possible.  The formatting code is also pretty flexible, allowing me to support colorization and a bunch of other nifty features; at some point, I may break the formatter into it's own npm module.

### Smart auto-consumption of STDIN

TBI - as of this version, if there is no data, we will block for reading STDIN.  We should only do this if the user expression refers to the well-known 'data' variable.  This would unify the 'process' and 'run' commands.

### Smart auto-detection of return value

TBI - as of this version, the last evaluated expression value is always returned.  However, sometimes, you want to mutate the existing data instead of returning a new value.  This should be easy.  If the expression does something like 'data.key = value', then the return value should be 'data'.  Today, you have to write 'data.key = value; data'.  I want that last part to be implicit, but only if you mutate the data variable.  And there should be a command-line flag "--retval={expr,data,auto}", with 'auto' being the default.

### Efficienct stream processing for set-oriented commands like 'map'

TBI - as of this version, all commands slurp the entire input stream and parse it before doing any data manipulation.  This works fine for the vast majority of scenarios, but if you actually had a 30GB JSON file, it would be a bit clunky.  For set-oriented commands like 'map', a smarter core engine plus a smarter JSON parser could enable stream-oriented processing where data processing occurs continuously as the input is read and streamed to the output without ever needing to store the entire dataset in memory at once.  This feature requires a custom JSON-parser and some serious fancy, but I'll get to it eventually.  If you have any performance-sensitive use-cases, post an issue on Github, and I'd be glad to work with you.


# Reporting Bugs / Requesting Features

I strongly encourage bug reports and feature requests.  I'll look at all of them eventually, though if I'm slammed at work or have something happening in my personal life, I might get a little bit behind.  It is my hobby project after-all, and by all means, you are welcome to submit a pull-request which I'll get to a heck of a lot faster than a feature I have to build myself :)

When reporting a bug that might be related to a dependency, it's usually helpful to list out which platform you are on.  Here's my info (as of 2012-11-05):

    # uname -a
    Darwin ddopson.local 11.4.2 Darwin Kernel Version 11.4.2: Thu Aug 23 16:25:48 PDT 2012; root:xnu-1699.32.7~1/RELEASE_X86_64 x86_64 i386 MacBookPro10,1 Darwin

    # node -v
    v0.8.1

    # npm -v
    1.1.35

    # npm ls
    underscore-cli@0.2.16 /Users/Dopson/work/other/underscore-cli
    ├── coffee-script@1.4.0
    ├─┬ commander@1.0.5
    │ └── keypress@0.1.0
    ├── JSONSelect@0.4.0
    ├─┬ mocha@1.6.0
    │ ├── commander@0.6.1
    │ ├── debug@0.7.0
    │ ├── diff@1.0.2
    │ ├── growl@1.5.1
    │ ├─┬ jade@0.26.3
    │ │ └── mkdirp@0.3.0
    │ ├── mkdirp@0.3.3
    │ └── ms@0.3.0
    ├── msgpack@0.1.7
    ├── underscore@1.4.2
    └── underscore.string@2.3.0


<a name="alternatives" />
# Alternatives

* [jsonpipe] (https://github.com/dvxhouse/jsonpipe) - Python focused, w/ a featureset centered around a single scenario
* [jshon] (http://kmkeen.com/jshon/) - Has a lot of functions, but very terse
* [json-command] (https://github.com/zpoley/json-command) - very limited
* [TickTick] (https://github.com/kristopolous/TickTick) - Bash focused JSON manipulation.  Iteresting w/ heavy Bash integration. Complements this tool.
* [json] (https://github.com/trentm/json) - Similar idea.
* [jsawk] (https://github.com/micha/jsawk) - Similar idea. Uses a custom JS environment. Good technical documentation.
* [jp] (https://github.com/kototama/jp) - Similar idea, implemented in Haskell. Use function combinators to select, filter and modify the JSON input. 
* [jsonpath] (http://code.google.com/p/jsonpath/wiki/Javascript) - this is not a CLI tool.  It's a runtime JS library.
* [json:select()] (http://jsonselect.org/#tryit) - this is not a CLI tool.  CSS-like selectors for JSON.  Very interesting idea.... now available as an Underscore-CLI command.
* [RecordStream] (https://github.com/benbernard/RecordStream) - PERL based tool intended to process JSON "rows".  I need to add similar multi-record support to underscore-CLI.
* [jq] (http://stedolan.github.io/jq/) single portable binary written in C with a decent amount of examples provided
Please add a Github issue if I've missed any.

