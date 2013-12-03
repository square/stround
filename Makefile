all: dist/stround.min.js dist/stround.closure.js

clean:
	rm -f dist/*

dist/stround.min.js:
	./script/build-min > dist/stround.min.js

dist/stround.closure.js:
	./script/build > dist/stround.closure.js
