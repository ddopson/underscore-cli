#!/bin/bash
set -e

jshint bin/underscore || exit
bin/underscore examples | grep '#' | grep -v '|' | cut -d" " -f2- | perl -pe 's/underscore/bin\/underscore/' | while read line; do 
  echo "# $line"
  echo -n 'prints: '
  bash -c "$line"
  echo
done | perl -pe 's/bin\/underscore/underscore/' > actual.txt
bin/underscore examples | perl -ne '/\|/ and $s=3; print unless $s-- > 0;' > expected.txt
diff -ur expected.txt actual.txt

