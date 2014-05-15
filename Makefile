all: dist

dist: dist/stround.min.js dist/stround.js

clean:
	rm -f dist/*

dist/stround.js: lib/stround.js lib/stround.umd.js Makefile
	es6-modules convert -f export-variable -Ilib -o $@ stround.umd

dist/stround.min.js: dist/stround.js Makefile
	cat dist/stround.js | closure-compiler > dist/stround.min.js

test: dist/stround.js dist/stround.min.js
	npm run test-all
