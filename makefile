TESTS = test/**/*.js
REPORTER = --reporter spec
OPTS = --no-colors --check-leaks 

test:
	mocha $(REPORTER) $(OPTS) $(TESTS)

.PHONY: test
