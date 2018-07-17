.PHONY: install build

all:
	make install
	make build

install:
	npm install --ignore-optional --non-interactive

build:
	mkdir -p ./dist
	cp index.js ./dist/index.js
	cp ecosystem.config.js ./dist/ecosystem.config.js
	cp -r ./node_modules ./dist/node_modules
	cp ./keys.sample.js ./dist/keys.js

