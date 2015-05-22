'use strict';
var npmRun = require('npm-run');

function exec(task, options, callback) {
  var cwd = options.cwd;
  var silent = !!options.silent;
  var child = npmRun.exec(task, {
    cwd: cwd,
    env: process.env,
    maxBuffer: 20 * 1024 * 1024
  }, function cb(err, stdout, stderr) {
    callback(err, {
      stdout: stdout,
      stderr: stderr,
      silent: silent
    });
  });

  if (!silent) {
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  }
}

module.exports = exec;
