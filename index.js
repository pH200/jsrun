/* globals Promise */
'use strict';
var util = require('util');
var gutil = require('gulp-util');
var Orchestrator = require('orchestrator');
var buildCommand = require('./lib/buildCommand');
var npmTaskRun = require('./lib/exec');

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
    return npmTaskRun(command, {cwd: cwd}, cb);
  }

  var args = Array.prototype.slice.call(arguments);
  var sliceLength = args.length - (hasOptions ? 2 : 1);

  this.add.apply(this, args.slice(0, sliceLength).concat([runScript]));
};

JsRun.prototype.justExec = function justExec(args, options, callback) {
  if (!Array.isArray(args)) {
    throw new Error('Invalid arguments');
  }
  options = options || {};
  options.cwd = options.cwd || process.cwd();

  var cmd = buildCommand.apply(buildCommand, args);

  if (typeof callback === 'function') {
    return npmTaskRun(cmd, options, callback);
  }

  var Pr;
  try {
    Pr = Promise;
  } catch (e) {
    if (e instanceof ReferenceError) {
      Pr = null;
    }
    throw e;
  }

  if (Pr) {
    return new Pr(function promise(resolve, reject) {
      return npmTaskRun(cmd, options, function cb(err, data) {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }
  return npmTaskRun(cmd, options, function noop() {
  });
};

JsRun.prototype.JsRun = JsRun;

var inst = new JsRun();
module.exports = inst;
