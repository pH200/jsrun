'use strict';
var jsrun = require('./');

jsrun.just('lint', [
  ['jshint', [
    'lib bin test index.js jsrunfile.js',
    ['--reporter', 'node_modules/jshint-stylish/stylish.js'],
    ['--exclude', 'node_modules']
  ]],
  '&&',
  ['jscs', 'lib bin test index.js']
]);

jsrun.just('mocha', ['mocha --reporter spec']);

var cover = [
  'istanbul', [
    ['cover', '_mocha'],
    ['--report', 'lcovonly -- -R spec']
  ]
];
jsrun.just('cover', cover);

// Can't write ['lint', 'cover'] because orchestrator runs them in parallel,
// which would mess up the console output.
jsrun.just('travis-test', ['lint'], cover.concat([
  '&&',
  'cat ./coverage/lcov.info',
  '|',
  'coveralls'
]));

jsrun.just('default', ['lint'], ['mocha --reporter spec']);
