'use strict';
var justrun = require('./');

justrun.run('lint', [
  ['jshint', [
    'lib bin test index.js justrunfile.js',
    ['--reporter', 'node_modules/jshint-stylish/stylish.js'],
    ['--exclude', 'node_modules']
  ]],
  '&&',
  ['jscs', 'lib bin test index.js']
]);

justrun.run('mocha', ['mocha --reporter spec']);

justrun.run('cover', [
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

justrun.task('default', ['lint', 'mocha']);
