'use strict';

var exec = require('../lib/exec');
var assert = require('assert');
require('mocha');

var path = require('path');
var level0 = path.join(__dirname, 'run-test', 'fixtures', 'level0');
var level1 = path.join(level0, 'node_modules', 'level1');
var level2 = path.join(level1, 'node_modules', 'level2');
var level = [level0, level1, level2];

describe('exec()', function() {
  it('should execute a npm command', function(done) {
    exec(
      'level1',
      {cwd: level[0]},
      function(err, data) {
        assert.equal(data.stdout.trim(), 'level1');
        done();
      }
    );
  });

  it('should pass arguments', function(done) {
    exec(
      'level1 here are some arguments',
      {cwd: level[0], silent: true},
      function(err, data) {
        assert.equal(data.stderr.trim(), 'here are some arguments');
        assert.equal(data.stdout.trim(), 'level1');
        done();
      }
    );
  });

  it('should execute bad command', function(done) {
    exec(
      'not-exist-adsjk',
      {cwd: level[0]},
      function(err) {
        assert.ok(err);
        assert.ok(err.code === 127 || err.code === 'ENOENT');
        done();
      }
    );
  });
});
