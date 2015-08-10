BABEL=$$(npm bin)/babel

all: dist

dist: dist/stround.min.js dist/stround.js

clean:
	rm -f dist/*

dist/stround.js: lib/stround.js Makefile
	$(BABEL) lib/stround.js -o $@ -m umd --module-id stround

dist/stround.min.js: dist/stround.js Makefile
	cat dist/stround.js | closure-compiler > dist/stround.min.js

test: dist/stround.js dist/stround.min.js
	npm run test-all
