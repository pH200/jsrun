'use strict';
var npmTaskRun = require('./exec');
var buildCommand = require('./buildCommand');

module.exports = function justExec(args, options, callback) {
  if (!Array.isArray(args)) {
    throw new Error('Invalid arguments');
  }
  options = options || {};
  options.cwd = options.cwd || process.cwd();

  var cmd = buildCommand.apply(buildCommand, args);

  if (typeof callback === 'function') {
    return npmTaskRun(cmd, options, callback);
  }

  var Pr = global.Promise;
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
