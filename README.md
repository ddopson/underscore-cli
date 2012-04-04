# Overview

This package provides a command-line interface for simple data processing that mirrors the capabilities of [underscore.js] (http://documentcloud.github.com/underscore/)

    Usage: underscore <command> [--in <filename>|--data <JSON>] [--out <filename>] [--quiet] [--strict] [--nowrap]

    Commands:

       help [command]     Print more detailed help and examples for a specific command
       examples           Print an exhaustive list of ALL examples
       print              Output the data without any transformations. Can be used to pretty-print JSON data.
       map <exp>          Map each value from a list/object through a transformation expression whose arguments are (value, key, list).'
       reduce <exp>       Boil a list down to a single value by successively combining each element with a running total.  Expression args: (total, value, key, list)
       reduceRight <exp>  Right-associative version of reduce. ie, 1 + (2 + (3 + 4)). Expression args: (total, value, key, list)
       find <exp>         Return the first value for which the expression Return a truish value.  Expression args: (value, key, list)
       filter <exp>       Return an array of all values that make the expression true.  Expression args: (value, key, list)
       reject <exp>       Return an array of all values that make the expression false.  Expression args: (value, key, list)
       flatten            Flattens a nested array (the nesting can be to any depth). If you pass '--shallow', the array will only be flattened a single level.
       pluck <key>        Extract a single property from a list of objects
       keys               Retrieve all the names of an object's properties.
       values             Retrieve all the values of an object's properties.
       extend <object>    Override properties in the input data.
       defaults <object>  Fill in missing properties in the input data.
       any <exp>          Return 'true' if any of the values in the input make the expression true.  Expression args: (value, key, list)
       all <exp>          Return 'true' if all values in the input make the expression true.  Expression args: (value, key, list)
       isObject           Return 'true' if the input data is an object with named properties
       isArray            Return 'true' if the input data is an array
       isString           Return 'true' if the input data is a string
       isNumber           Return 'true' if the input data is a number

    Options:

      -h, --help            output usage information
      -V, --version         output the version number
      -i, --in <filename>   The data file to load.  If not specified, defaults to stdin.
      -o, --out <filename>  The output file.  If not specified, defaults to stdout.
      -d, --data <JSON>     Input data provided in lieu of a filename
      -q, --quiet           Suppress normal output.  'console.log' will still trigger output.
      --strict              Use strict JSON parsing instead of more lax 'eval' syntax.  To avoid security concerns, use this with ANY data from an external source.
      --nowrap              Instead of an expression like 'value+1', provide a full function body like 'return value+1;'.

    Examples:

      # underscore map --data '[1, 2, 3, 4]' 'value+1'
      prints: [ 2, 3, 4, 5 ]
      
      # underscore map --data '{"a": [1, 4], "b": [2, 8]}' '_.max(value)'
      prints: [ 4, 8 ]
      
      # echo '{"foo":1, "bar":2}' | underscore map -q 'console.log("key = ", key)'
      prints: key = foo
      prints: key = bar
      
      # underscore pluck --data "[{name : 'moe', age : 40}, {name : 'larry', age : 50}, {name : 'curly', age : 60}]" name
      prints: [ 'moe', 'larry', 'curly' ]
      
      # underscore keys --data '{name : "larry", age : 50}'
      prints: [ 'name', 'age' ]
      
      # underscore reduce --data '[1, 2, 3, 4]' 'total+value'
      prints: 10
      

  See 'underscore help <command>' for more information and examples on a specific command.


