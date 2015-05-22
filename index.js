'use strict';
var util = require('util');
var gutil = require('gulp-util');
var Orchestrator = require('orchestrator');
var buildCommand = require('./lib/buildCommand');
var npmTaskRun = require('./lib/exec');
var justExec = require('./lib/justExec');

function JsRun() {
  Orchestrator.call(this);
}
util.inherits(JsRun, Orchestrator);

JsRun.prototype.task = JsRun.prototype.add;

JsRun.prototype.just = function just() {
  if (arguments.length < 2) {
    throw new Error('Invalid argument for just task');
  }
  var runArgs = arguments[arguments.length - 1];
  if (!Array.isArray(runArgs)) {
    throw new Error('Invalid argument for just task');
  }
  var options = arguments[arguments.length - 2];
  var hasOptions = options && typeof options === 'object';
  var skipRun = hasOptions ? !!options.skipRun : false;
  var cwd = (hasOptions ? options.cwd : null) || process.cwd();

  var command = buildCommand.apply(buildCommand, runArgs);
  function runScript(cb) {
    gutil.log('[run-script]', command);
    if (skipRun) {
      return cb();
    }
    return npmTaskRun(command, {cwd: cwd}, function callback(err) {
      if (err) {
        var cmdErr = new gutil.PluginError(
          '[run-script]',
          'Command failed: ' + command
        );
        cmdErr.code = err.code;
        return cb(cmdErr);
      }
      return cb();
    });
  }

  var args = Array.prototype.slice.call(arguments);
  var sliceLength = args.length - (hasOptions ? 2 : 1);

  this.add.apply(this, args.slice(0, sliceLength).concat([runScript]));
};

JsRun.prototype.justExec = justExec;

JsRun.prototype.JsRun = JsRun;

var inst = new JsRun();
module.exports = inst;
