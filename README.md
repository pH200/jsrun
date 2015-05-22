# JsRun

The npm run-script build system, compatible with [gulp].

## The struggle

Does this seems familiar to you?

```js
{
  "name": "my-awesome-package",
  ...
  "scripts": {
    // My very long lines run-scripts:
    "lint": "jshint lib test index.js --reporter node_modules/jshint-stylish/stylish.js --exclude node_modules",
    "test": "npm run lint && node test/index.js | tap-spec",
    "build": "browserify index.js -d -t babelify | uglifyjs -m -c > bundle.min.js",
    "cover": "istanbul cover --report html --print detail ./test/index.js",
    "coveralls": "npm run cover && istanbul report lcov && cat coverage/lcov.info | coveralls && rm -rf ./coverage"
  }
}
```

Well, it happened to me. My run-scripts grew longer from time to time.
And one day, I just couldn't take it anymore.

## Introducing JsRun - Just run your scripts

Thanks to [npm-run], JsRun runs your local bins, just like `npm run stuff`.

```js
// jsrunfile.js
var jsrun = require('jsrun');

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

var bundleFileName = 'bundle.min.js';
jsrun.just('build', [
  // Create as many layers of array as you want
  ['browserify', [
    'index.js',
    '-d',
    ['-t', 'babelify']
  ]],
  // You can use "|" and "&&" in JsRun
  '|',
  'uglifyjs', [
    '-m', '-c',
    // Use string variables
    ['>', bundleFileName]
  ]
]);

// Just like gulp.task
// You can use callbacks, promises and of course, streams.
jsrun.task('hello', function(cb) {
  console.log('Hello');

  setTimeout(function() {
    console.log('World!');
    cb();
  }, 500);
});

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
and it is impossible in the `package.json`. And we want variables for filenames
in different scripts, again, impossible for `package.json`.

## Documentation

[Documentation page](/docs/README.md)

## Gulp

JsRun is a fork of [gulp]. We simply took the file-system-related
stuff(vinyl-fs) away and put the [npm-run] task runner inside.

In addition, thanks to the modular source code of gulp, JsRun is made simple
and lean. The implementation of JsRun is only about 0.5kloc.

[gulp]: https://github.com/gulpjs/gulp
[npm-run]: https://github.com/timoxley/npm-run
