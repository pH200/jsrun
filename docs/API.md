## JsRun API docs

### jsrun.just(name[, deps], commandTree)

#### name

The name of the task. Tasks that you want to run from the command line should not have spaces in them.

#### deps
Type: `Array`

An array of tasks to be executed and completed before your task will run.

#### commandTree
Type: `Array`

The commands that will be executed.

```js
jsrun.just('test', [
  // A simple line of command
  'mocha --reporter spec'
]);
```

```js
jsrun.just('lint', [
  // Create as many layers of array as you want
  ['jshint', [
    'lib test index.js',
    ['--reporter', 'node_modules/jshint-stylish/stylish.js'],
    ['--exclude', 'node_modules']
  ]],
  // You can use "&&", "|" and other operators
  '&&',
  // Using array for commands is recommended but not required
  'jscs', 'lib bin test index.js'
]);
```

### jsrun.task(name[, deps], fn)

Define a task using [Orchestrator].

```js
jsrun.task('somename', function() {
  // Do stuff
});
```

#### name

The name of the task. Tasks that you want to run from the command line should not have spaces in them.

#### deps
Type: `Array`

An array of tasks to be executed and completed before your task will run.

```js
jsrun.task('mytask', ['array', 'of', 'task', 'names'], function() {
  // Do stuff
});
```

**Note:** Are your tasks running before the dependencies are complete?  Make sure your dependency tasks are correctly using the async run hints: take in a callback or return a promise or event stream.

#### fn

The function that performs the task's operations. Generally this takes the form of `jsrun.src().pipe(someplugin())`.

#### Async task support

Tasks can be made asynchronous if its `fn` does one of the following:

##### Accept a callback

```javascript
// run a command in a shell
var exec = require('child_process').exec;
jsrun.task('jekyll', function(cb) {
  // build Jekyll
  exec('jekyll build', function(err) {
    if (err) return cb(err); // return error
    cb(); // finished task
  });
});
```

##### Return a stream

```js
jsrun.task('somename', function() {
  var stream = jsrun.src('client/**/*.js')
    .pipe(minify())
    .pipe(jsrun.dest('build'));
  return stream;
});
```

##### Return a promise

```javascript
var Q = require('q');

jsrun.task('somename', function() {
  var deferred = Q.defer();

  // do async stuff
  setTimeout(function() {
    deferred.resolve();
  }, 1);

  return deferred.promise;
});
```

**Note:** By default, tasks run with maximum concurrency -- e.g. it launches all the tasks at once and waits for nothing. If you want to create a series where tasks run in a particular order, you need to do two things:

- give it a hint to tell it when the task is done,
- and give it a hint that a task depends on completion of another.

For these examples, let's presume you have two tasks, "one" and "two" that you specifically want to run in this order:

1. In task "one" you add a hint to tell it when the task is done.  Either take in a callback and call it when you're
done or return a promise or stream that the engine should wait to resolve or end respectively.

2. In task "two" you add a hint telling the engine that it depends on completion of the first task.

So this example would look like this:

```js
var jsrun = require('jsrun');

// takes in a callback so the engine knows when it'll be done
jsrun.task('one', function(cb) {
    // do stuff -- async or otherwise
    cb(err); // if err is not null and not undefined, the run will stop, and note that it failed
});

// identifies a dependent task must be complete before this one begins
jsrun.task('two', ['one'], function() {
    // task 'one' is done now
});

jsrun.task('default', ['one', 'two']);
```

[Orchestrator]: https://github.com/robrich/orchestrator
