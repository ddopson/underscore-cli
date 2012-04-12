#!/bin/bash

jshint bin/underscore || exit
bin/underscore examples | grep -v '#' | grep . | perl -pe 's/underscore/bin\/underscore/' | while read line; do 
  echo "$line"
  bash -c "$line" | perl -pe 's/^/# /g'
  echo
done | perl -pe 's/bin\/underscore/underscore/' > actual.txt
bin/underscore examples > expected.txt
diff -ur expected.txt actual.txt

