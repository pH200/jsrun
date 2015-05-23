# JsRun

[![Build Status](https://travis-ci.org/pH200/jsrun.svg?branch=master)](https://travis-ci.org/pH200/jsrun)

The npm run-script build system, compatible with [gulp].

## The struggle

Does this seems familiar to you?

```js
{
  "name": "my-awesome-package",
  ...
  "scripts": {
    // My very long and lengthy lines of scripts:
    "lint": "jshint lib test index.js --reporter node_modules/jshint-stylish/stylish.js --exclude node_modules",
    "test": "npm run lint && node test/index.js | tap-spec",
    "build": "browserify index.js -d -t babelify | exorcist bundle.js.map | uglifyjs -m -c warnings=false --in-source-map bundle.js.map --source-map-include-sources --source-map-url bundle.js.map --source-map dist/bundle.min.js.map > dist/bundle.min.js",
    "cover": "istanbul cover --report html --print detail ./test/index.js",
    "coveralls": "npm run cover && istanbul report lcov && cat coverage/lcov.info | coveralls && rm -rf ./coverage"
  }
}
```

Well, it happened to me. My run-scripts grew longer from time to time.
And one day, I just couldn't take it anymore.

## Introducing JsRun - Just run your scripts

Thanks to [npm-run], JsRun runs your local bins, like `npm run stuff`.
For example, you can `npm install --save-dev jshint` and use `jshint` command
from your local `node_modules` in JsRun.

Sample `jsrunfile.js`:

```js
var jsrun = require('jsrun');

// Define a new task 'lint' with the command 'jshint lib test ...'
jsrun.just('lint', [
  'jshint', [
    'lib test index.js',
    ['--reporter', 'node_modules/jshint-stylish/stylish.js'],
    ['--exclude', 'node_modules']
  ]
]);

// Use task dependencies like we did in gulp
jsrun.just('test', ['lint'], [
  'node test/index.js | tap-spec'
]);

var bundleFileName = 'dist/bundle.min.js';
jsrun.just('build', [
  // Create as many layers of array as you want
  ['browserify', [
    'index.js',
    ['-d', '-t', 'babelify']
  ]],
  // You can use "|" and "&&" in JsRun
  '|',
  'exorcist bundle.js.map',
  '|',
  'uglifyjs', [
    '-m', '-c warnings=false',
    ['--in-source-map', 'bundle.js.map'],
    '--source-map-include-sources',
    ['--source-map-url', 'bundle.js.map'],
    ['--source-map', 'dist/bundle.min.js.map'],
    // Use string variables
    ['>', bundleFileName]
  ]
]);

// jsrun.task is gulp.task
// You can use callbacks, promises and of course, streams
jsrun.task('hello', function(cb) {
  console.log('Hello');

  setTimeout(function() {
    console.log('World!');
    cb();
  }, 500);
});

// The default task
jsrun.task('default', ['lint', 'test', 'build']);
```

## Installation

`npm install jsrun -g`

## Why?

### No more plugins

With JsRun, you won't need another plugin like `grunt-contrib-something` or
`gulp-this-and-that`. Your tools always stay updated instead of relying on
plugins. And most importantly, JsRun is **always** compatible to your tools,
as long as they are command-line scripts.

### Comments and variables

Sometimes, there might be something you want to comment in your build script,
and it is impossible in the `package.json`. And we want variables for sharing
values in different scripts. Again, it's difficult for `package.json`.

## FAQ

### Copying, moving and removing files

You can always write shell scripts inside JsRun for these tasks. However,
if you want to keep these shell commands portable, we recommend using
[shelljs].

### Watching file changes

You can use watch mode from your tools if they are available. On the other
hand, if it's not available, you can try [catw].

### JsRun eats its own dog food

JsRun's [jsrunfile.js](/jsrunfile.js)

## Documentation

[Documentation page](/docs/README.md)

## Gulp

JsRun is a fork of [gulp]. We simply took the file-system-related
stuff(vinyl-fs) away and put the [npm-run] task runner inside.

In addition, thanks to the modular source code of gulp, JsRun is made simple
and lean. The implementation of JsRun is only about 0.5kloc.

[gulp]: https://github.com/gulpjs/gulp
[npm-run]: https://github.com/timoxley/npm-run
[shelljs]: https://github.com/arturadib/shelljs
[catw]: https://github.com/substack/catw
