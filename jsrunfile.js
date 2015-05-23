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

var cover = ['istanbul cover _mocha'];
jsrun.just('cover', cover);

jsrun.just('travis-test', ['lint'], cover.concat([
  ['--report', 'lcovonly -- -R spec'],
  '&&',
  'cat ./coverage/lcov.info',
  '|',
  'coveralls'
]));

jsrun.just('default', ['lint'], ['mocha --reporter spec']);
