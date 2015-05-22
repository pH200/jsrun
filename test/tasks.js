'use strict';

var gulp = require('../');
var assert = require('assert');
require('mocha');

var path = require('path');
var level0 = path.join(__dirname, 'run-test', 'fixtures', 'level0');
var level1 = path.join(level0, 'node_modules', 'level1');
var level2 = path.join(level1, 'node_modules', 'level2');
var level = [level0, level1, level2];

describe('gulp tasks', function() {
  describe('task()', function() {
    it('should define a task', function(done) {
      var fn = function() {};
      gulp.task('test', fn);
      assert.ok(gulp.tasks.test);
      assert.equal(gulp.tasks.test.fn, fn);
      gulp.reset();
      done();
    });
  });

  describe('run()', function() {
    it('should define a run-script task', function(done) {
      gulp.run('test', [
        'foo', 'bar'
      ]);
      assert.ok(gulp.tasks.test);
      assert.ok(/runScript/.test(gulp.tasks.test.fn.toString()));
      gulp.reset();
      done();
    });

    it('should be able to run the defined task', function(done) {
      gulp.run('test', {cwd: level[0]}, [
        ['level1', [
          '-d',
          ['-t', 'babelify']
        ]]
      ]);
      gulp.start('test', function(err) {
        assert.equal(err, null);
        assert.equal(gulp.isRunning, false);
        done();
      });
    });

    it('should be able to run mocha', function(done) {
      gulp.run('test', [
        ['mocha', [
          '--version'
        ]]
      ]);
      gulp.start('test', function(err) {
        assert.equal(err, null);
        assert.equal(gulp.isRunning, false);
        done();
      });
    });
  });

  describe('justExec()', function() {
    it('should run npm executables', function(done) {
      gulp.justExec([
        ['level1', [
          '-d',
          ['-t', 'babelify']
        ]]
      ], {cwd: level[0]}, function(err, data) {
        assert.equal(err, null);
        assert.equal(data.stderr.trim(), '-d -t babelify');
        assert.equal(data.stdout.trim(), 'level1');
        done();
      });
    });

    it('should return Promise', function() {
      return gulp.justExec(['mocha --version']).then(function(data) {
        assert.ok(/[0-9]+\.[0-9]+\.[0-9]+/.test(data.stdout.trim()));
      });
    });
  });
});
