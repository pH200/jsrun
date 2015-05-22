'use strict';

var buildCommand = require('../lib/buildCommand');
var assert = require('assert');

require('mocha');

describe('buildCommand()', function() {
  it('should build a simple command', function() {
    assert.equal(buildCommand('foo'), 'foo');
  });

  it('should return empty string', function() {
    assert.equal(buildCommand(), '');
  });

  it('should concat commands', function() {
    assert.equal(buildCommand('foo', 'bar'), 'foo bar');
  });

  it('should build commands with arguments', function() {
    var input = 'app.js';
    var sourceMap = 'app.js.map';
    var browserify = ['browserify', [
      input,
      '-d',
      ['-t', 'babelify']
    ]];
    var exorcist = ['exorcist', [
      sourceMap
    ]];
    var result = 'browserify app.js -d -t babelify | exorcist app.js.map';

    assert.equal(buildCommand(browserify, '|', exorcist), result);
  });

  it('should build commands with string arguments', function() {
    var browserify = ['browserify', 'app.js -d -t babelify'];
    var result = 'browserify app.js -d -t babelify';

    assert.equal(buildCommand(browserify), result);
  });

  it('should throw error for the invalid command name', function() {
    assert.throws(function() {
      buildCommand([123]);
    }, /invalid command/i);
  });

  it('should throw error for the invalid arguments', function() {
    assert.throws(function() {
      buildCommand(['browserify', 123]);
    }, /should be an array/i);
  });

  it('should throw error for extra arguments', function() {
    assert.throws(function() {
      buildCommand(['browserify', ['-t'], '-o']);
    }, /object should be/i);
  });
});
