# Getting Started

## API

[API documentation](API.md)

## Setting up

#### 1. Install JsRun globally:

```sh
$ npm install --global jsrun
```

#### 2. Install JsRun in your project devDependencies:

```sh
$ npm install --save-dev jsrun
```

#### 3. Create a `jsrunfile.js` at the root of your project:

```js
var jsrun = require('jsrun');

jsrun.just('default', ['echo', '"Hello world!"']);
```

#### 4. Run JsRun:

```sh
$ jsrun
```

The default task will run and print "Hello world!".

To run individual tasks, use `jsrun <task> <othertask>`.

## More

You can check out the documentations of [gulp] for more informations. Keep in
mind that JsRun prefer shell scripts over gulp's file API and plugins.

[gulp]: https://github.com/gulpjs/gulp
