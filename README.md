# Overview

This package provides a command-line interface for simple data processing that mirrors the capabilities of [underscore.js] (http://documentcloud.github.com/underscore/)


    # echo "[1, 2, 3, 4 ]" | bin/underscore map 'value+1'
    [ 2, 3, 4, 5 ]

    # echo "[1, 2, 3, 4 ]" | bin/underscore reduce 'total+value' 0
    10

    #echo '{"foo":1, "bar":2}' | bin/underscore reduce 'console.log("key:", key), total+value' 0
    key: foo
    key: bar
    3

