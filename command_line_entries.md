# Useful command line entries for developers
Assumes you're using bash shell.

On windows, you must replace forward slashes (/) with backslashes (\\).

Even then, certain commands won't work on Windows
(e.g. commands using * for file/directory names)

Assume console commands are executed from top folder of repository.

## Installing dependencies
Must first install Node.js, which comes with npm, the javascript package
manager.

Install all dependencies (production and dev) specified in package.json:
```
npm install
```

Install production dependencies but NOT dev dependencies:
```
npm install --only=production
```

Install dev dependencies but NOT production dependencies
```
npm install --only=dev
```

## Building project
Build bundle JS file (after installing dependencies):
```
node_modules/.bin/browserify src/main.js -o build/bundle.js
```

Build bundle JS file with debug source maps:
```
node_modules/.bin/browserify src/main.js -o build/bundle.js --debug
```
This way, console output for errors will give their location in the original
.js files, rather than their location in bundle.js. However, this creates a
larger sized file and should be omitted for bundle.js used in production.

Build bundle JS file, ignoring any missing files called for by require:
```
node_modules/.bin/browserify src/main.js -o build/bundle.js --ignore-missing
```

Continually rebuild bundle JS file whenever scripts are modified:
```
node_modules/.bin/watchify src/main.js -o build/bundle.js
```

Continually rebuild bundle JS file whenever scripts are modified with debug
source maps:
```
node_modules/.bin/watchify src/main.js -o build/bundle.js --debug
```

Continually rebuild bundle JS file whenve4r scripts are modified, ignoring any
missing files called for by require:
```
node_modules/.bin/watchify src/main.js -o build/bundle.js --ignore-missing
```

Alternatively, you can name bundle.js whatever you want, as long as you
modify the <src> tag in the html file using it to match.

## Building documentation
Build documentation:
Build all .js files in src/ directory (but not in any subdirectories):
```
node_modules/.bin/jsdoc2md src/*.js > documentation.md
```

If there are any js scripts inside subdirectories of src/ you need to add more
path arguments.

For example, if js scripts are found in folders one level
deeper than src/, use:
```
node_modules/.bin/jsdoc2md src/*.js src/*/*.js > documentation.md
```

If js scripts are found in folders two levels deeper than src/, use:
```
node_modules/.bin/jsdoc2md src/*.js src/*/*.js src/*/*/*.js > documentation.md
```
...and so on.

## Miscellaneous
See list of node modules:
```
npm ls
```

See list of node modules, but only including the top-level modules
(recommended):
```
npm ls --depth=0
```

Remove extraneous npm modules:
```
npm prune
```
