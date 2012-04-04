underscore examples | grep '#' | grep -v '|' | cut -d" " -f2- | while read line; do 
  echo "# $line"
  echo -n 'prints: '
  bash -c "$line"
  echo
done > actual.txt
underscore examples | perl -ne '/\|/ and $s=3; print unless $s-- > 0;' > expected.txt
diff -ur expected.txt actual.txt

