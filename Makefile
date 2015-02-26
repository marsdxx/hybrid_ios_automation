SRC=$(shell find lib -type f -name "*.js")
BUILD = $(subst lib/,build/,$(SRC))

all: test
install:
	@npm install
test: install
	@./node_modules/.bin/mocha
jshint:
	@./node_modules/jshint/bin/jshint .
server:
	@./node_modules/startserver/bin/startserver
.PHONY: test
