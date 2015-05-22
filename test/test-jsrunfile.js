'use strict';
var jsrun = require('../');

jsrun.just('lint', {skipRun: true}, [
  'jshint', [
    'lib test index.js',
    ['--reporter', 'node_modules/jshint-stylish/stylish.js'],
    ['--exclude', 'node_modules']
  ]
]);

// Use task dependencies like we did in gulp
jsrun.just('test', ['lint'], {skipRun: true}, [
  'node test/index.js | tap-spec'
]);

var bundleFileName = 'bundle.min.js';
jsrun.just('build', {skipRun: true}, [
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
