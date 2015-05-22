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
  var NAME = '[run-script]';

  if (arguments.length < 2) {
    var invalidArgsErr = new Error(
      'Invalid argument for just task\n' +
      'args: ' + JSON.stringify(arguments, null, 2)
    );
    throw invalidArgsErr;
  }
  var runArgs = arguments[arguments.length - 1];
  if (!Array.isArray(runArgs)) {
    var invalidCommandTreeErr = new Error(
      'Invalid argument for just task\n' +
      'args: ' + JSON.stringify(arguments, null, 2) +
      '\ncommandTree: ' + JSON.stringify(runArgs, null, 2)
    );
    throw invalidCommandTreeErr;
  }

  var options = arguments[arguments.length - 2];
  var hasOptions = options &&
    typeof options === 'object' &&
    !Array.isArray(options);
  var skipRun = hasOptions ? !!options.skipRun : false;
  var cwd = (hasOptions ? options.cwd : null) || process.cwd();

  var command = buildCommand.apply(buildCommand, runArgs);

  function runScript(cb) {
    gutil.log(NAME, command);
    if (skipRun) {
      return cb();
    }
    return npmTaskRun(command, {cwd: cwd}, function callback(err) {
      if (err) {
        var cmdErr = new gutil.PluginError(
          NAME,
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
  var addTaskArgs = args.slice(0, sliceLength).concat([runScript]);
  this.add.apply(this, addTaskArgs);
};

JsRun.prototype.justExec = justExec;

JsRun.prototype.JsRun = JsRun;

var inst = new JsRun();
module.exports = inst;
