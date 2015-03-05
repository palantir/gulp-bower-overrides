# gulp-bower-overrides [![Build Status](https://travis-ci.org/giladgray/gulp-bower-overrides.svg?branch=master)](https://travis-ci.org/giladgray/gulp-bower-overrides)

> Merge overrides into bower.json files to produce "fixed" packages.


## Install

```
$ npm install --save-dev gulp-bower-overrides
```


## Usage

```js
var gulp = require('gulp');
var bowerOverrides = require('gulp-bower-overrides');

gulp.task('bower', function () {
  return gulp.src('bower_components/*/bower.json')
    .pipe(bowerOverrides())
    .pipe(gulp.dest('dist'));
});
```


## API

### bowerOverrides(options)

#### options

##### bowerPath

Type: `String`  
Default: `'./bower.json'`

Path to project bower.json file with `overrides` block.

##### bowerContents

Type: `String`

Contents of bower.json file, if you'd prefer to pass it directly.


## License

MIT © [Gilad Gray](https://github.com/giladgray)
