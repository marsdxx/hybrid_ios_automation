SRC=$(shell find lib -type f -name "*.js")
BUILD = $(subst lib/,build/,$(SRC))

all: test
install:
	@npm install
test: install
	@./node_modules/.bin/mocha ./test/hybrid.test.js
testsim: install
	@echo Requires root permission. && sudo authorize_ios && ./node_modules/.bin/mocha -s ./test/hybrid.test.js
jshint:
	@./node_modules/jshint/bin/jshint .
server:
	@./node_modules/startserver/bin/startserver
.PHONY: test
