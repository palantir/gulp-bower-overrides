# gulp-bower-overrides [![Build Status](https://travis-ci.org/palantir/gulp-bower-overrides.svg?branch=master)](https://travis-ci.org/palantir/gulp-bower-overrides)

> Merge overrides into bower.json files to produce "fixed" packages.


## Install

```
$ npm install --save-dev gulp-bower-overrides
```


## Usage

Define an `overrides` block in your bower.json per the [proposed
spec](https://github.com/bower/bower.json-spec/pull/27): an inline object literal or path to .json
file that defines a map of package names to overridden properties.

Take the Lodash package as an example. By default, Lodash's bower.json specifies `lodash.compat.js`
as the main file, which is the compatibility build for new & old environments. If you'd like to use
the fancy modern build instead, you could provide the following overrides definition in your
application's root bower.json file:

```json
{
  "name": "my-application",
  "dependencies": {
    "lodash": "latest"
  },
  "overrides": {
    "lodash": {
      "main": "./dist/lodash.js"
    }
  }
}
```

Then define a gulp task that runs each bower.json file through the plugin. The contents of each
bower.json will be merged with the corresponding overrides block (if present) to produce a new
bower.json according to your wishes.

```js
var gulp = require('gulp');

gulp.task('bower', function () {
  var bowerOverrides = require('gulp-bower-overrides');

  return gulp.src('bower_components/*/bower.json')
    .pipe(bowerOverrides())
    .pipe(gulp.dest('dist'));
});
```

Example output Lodash bower.json (trimmed for readability) given configuration above:

```json
{
  "name": "lodash",
  "version": "2.4.1",
  "main": "./dist/lodash.js"
}
```


## API

### bowerOverrides(options)

The plugin itself. Merges overrides with each bower.json.

#### options

##### bowerPath

Type: `String`  
Default: `'./bower.json'`

Path to project bower.json file with `overrides` block.

##### overrides

Type: `String`, `Object`

Path to a .json file or object literal value containing package overrides. If provided, this value
will be used instead of loading from a bower.json file.

### bowerOverrides.mapJSON(iterator)

A thin wrapper around `through2-map.obj()` that passes the parsed JSON content of each file to the
iterator and updates the content with stringified return value.

#### iterator

Map function to call for each file in stream. Receives `(file, json)` arguments and returns new JSON
content.

## License

MIT © [Palantir Technologies](https://palantir.com/)
