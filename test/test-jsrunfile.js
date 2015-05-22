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

var bundleFileName = 'dist/bundle.min.js';
jsrun.just('build', {skipRun: true}, [
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

jsrun.task('default', ['lint', 'test', 'build']);
