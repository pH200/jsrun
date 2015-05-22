'use strict';
var jsrun = require('./');

jsrun.run('lint', [
  ['jshint', [
    'lib bin test index.js jsrunfile.js',
    ['--reporter', 'node_modules/jshint-stylish/stylish.js'],
    ['--exclude', 'node_modules']
  ]],
  '&&',
  ['jscs', 'lib bin test index.js']
]);

jsrun.run('mocha', ['mocha --reporter spec']);

jsrun.run('cover', [
  ['istanbul', [
    ['cover', '_mocha'],
    ['--report', 'lcovonly -- -R spec']
  ]],
  // '&&',
  // 'cat ./coverage/lcov.info',
  // '|',
  // 'coveralls',
  '&&',
  'rm -rf ./coverage'
]);

jsrun.task('default', ['lint', 'mocha']);
