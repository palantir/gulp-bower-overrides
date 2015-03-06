'use strict';

var fs = require('fs');
var assert = require('assert');
var gutil = require('gulp-util');
var bowerOverrides = require('./');

var mainBowerJson = require('./bower.json');

function parseJson(file) {
  return JSON.parse(file.contents.toString());
}

function writeToStream(stream, contents) {
  stream.write(new gutil.File({
    base: __dirname,
    path: __dirname + '/bower.json',
    contents: contents
  }));
  stream.end();
}

function testStream(stream, overrides, done, files) {
  stream.on('data', function (file) {
    var json = parseJson(file);
    Object.keys(overrides[json.name]).forEach(function(key) {
      assert.strictEqual(json[key], overrides[json.name][key]);
    });
  });

  stream.on('end', done);

  if (files) {
    [].concat(files).map(fs.readFileSync).forEach(function(file) {
      writeToStream(stream, file);
    });
  }
}

describe('gulp-bower-overrides', function() {
  it('should merge overrides block into bower.json src', function(done) {
    var stream = bowerOverrides();

    testStream(stream, mainBowerJson.overrides, done, './fixtures/bower-marionette.json');
  });

  it('should load file at bowerPath', function(done) {
    var bowerJson = require('./fixtures/bower.json');
    var stream = bowerOverrides({bowerPath: './fixtures/bower.json'});

    testStream(stream, bowerJson.overrides, done,
      './fixtures/bower_components/lodash/bower.json');
  });

  it('should use overrides object instead of loading file', function(done) {
    var overrides = {
      'backbone.marionette': {
        'main': 'override-this.coffee'
      }
    };
    var stream = bowerOverrides({overrides: overrides});

    testStream(stream, overrides, done, './fixtures/bower-marionette.json');
  });

  it('should load overrides from file if value is string', function(done) {
    var overrides = './fixtures/overrides.json';
    var stream = bowerOverrides({overrides: overrides});

    testStream(stream, require(overrides), done, './fixtures/bower-marionette.json');
  });


});
