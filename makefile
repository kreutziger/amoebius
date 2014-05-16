TESTS = test/**/*.js
SPEC_REPORTER = --reporter spec
NYAN_REPORTER = --reporter nyan
OPTS = --check-leaks 

spec_test:
	mocha $(SPEC_REPORTER) $(OPTS) $(TESTS)

nyan_test:
	mocha $(NYAN_REPORTER) $(OPTS) $(TESTS)

.PHONY: nyan_test
