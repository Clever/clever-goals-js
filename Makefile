include node.mk
.PHONY: all test build lint
SHELL := /bin/bash

TS_FILES := $(shell find . -name "*.ts" -not -path "./node_modules/*" -not -name "*numbro-polyfill.ts")

all: test build

lint:
	@echo "Linting..."
	@./node_modules/.bin/eslint $(TS_FILES)
	@./node_modules/.bin/eslint -c .eslintrc.js $(TS_FILES)

test: lint
	@echo "Testing..."
	@npm run --silent test

build:
	@echo "Building..."
	@npm run --silent build

dev-build:
	@echo "Building..."
	@npm run dev-build
