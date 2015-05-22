'use strict';
var flatten = require('lodash.flatten');

function buildCommand() {
  var exec = '';
  var args = Array.prototype.slice.call(arguments);
  var flatArgs = flatten(args, true);
  for (var i = 0; i < flatArgs.length; i++) {
    if (typeof flatArgs[i] !== 'string') {
      throw new Error(
        'Invalid argument: ' + flatArgs[i] +
        '\nEvery argument must be a string\nCommand tree: ' +
        JSON.stringify(args, null, 2)
      );
    }
    exec += ' ' + flatArgs[i];
  }
  return exec.substr(1);
}

module.exports = buildCommand;
