'use strict';

function flatten(array) {
  var output = '';
  for (var i = 0; i < array.length; i++) {
    if (Array.isArray(array[i])) {
      for (var j = 0; j < array[i].length; j++) {
        output += ' ' + array[i][j];
      }
    } else {
      output += ' ' + array[i];
    }
  }
  return output;
}

function buildCommand() {
  var exec = '';
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (!arg) {
      continue;
    }

    var argType = typeof arg;
    if (argType === 'string') {
      exec += ' ' + arg;
    } else if (Array.isArray(arg)) {
      if (typeof arg[0] !== 'string') {
        throw new Error('Invalid command: ' + arg[0]);
      }
      if (arg[1] && !Array.isArray(arg[1]) && typeof arg[1] !== 'string') {
        throw new Error(
          'Invalid command. Arguments should be an array or string\n' +
          arg
        );
      }
      if (arg[2]) {
        throw new Error(
          'Invalid command. ' +
          'The command object should be ' +
          '[command, [args]]'
        );
      }
      exec += ' ' + arg[0];
      if (Array.isArray(arg[1])) {
        exec += flatten(arg[1]);
      } else if (typeof arg[1] === 'string') {
        exec += ' ' + arg[1];
      }
    }
  }
  return exec.substr(1);
}

module.exports = buildCommand;
