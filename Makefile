.PHONY: install build

all:
	make install
	make build

install:
	npm install --ignore-optional --non-interactive

build:
	mkdir -p ./dist
	cp index.js ./dist/index.js
	echo "module.exports = {darksky: $DARK_SKY, images: '$GOOGLE_IMAGES'}" > ./dist/keys.js
	cp ecosystem.config.js ./dist/ecosystem.config.js
	cp -r ./node_modules ./dist/node_modules

