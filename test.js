'use strict';

var fs = require('fs');
var assert = require('assert');
var gutil = require('gulp-util');
var bowerOverrides = require('./');

var mainBowerJson = require('./bower.json');

function writeToStream(stream, contents) {
  stream.write(new gutil.File({
    base: __dirname,
    path: __dirname + '/bower.json',
    contents: contents
  }));
  stream.end();
}

function parseJson(file) {
  return JSON.parse(file.contents.toString());
}

describe('gulp-bower-overrides', function() {
  it('should merge overrides block into bower.json src', function(done) {
    var stream = bowerOverrides();

    stream.on('data', function (file) {
      var json = parseJson(file);
      assert.strictEqual(json.main, mainBowerJson.overrides[json.name].main);
    });

    stream.on('end', done);

    writeToStream(stream, fs.readFileSync('./fixtures/bower-marionette.json'));
  });

  describe('options', function() {
    it('should load file at bowerPath', function(done) {
      var bowerJson = require('./fixtures/bower.json');

      var stream = bowerOverrides({bowerPath: './fixtures/bower.json'});

      stream.on('data', function (file) {
        var json = parseJson(file);
        assert.strictEqual(json.main, bowerJson.overrides[json.name].main);
        assert.strictEqual(json.version, bowerJson.overrides[json.name].version);
      });

      stream.on('end', done);

      writeToStream(stream, fs.readFileSync('./fixtures/bower-marionette.json'));
    });

    it('should use overrides object instead of loading file', function(done) {
      var overrides = {
        'backbone.marionette': {
          'main': 'override-this.coffee'
        }
      };

      var stream = bowerOverrides({overrides: overrides});

      stream.on('data', function (file) {
        var json = parseJson(file);
        assert.strictEqual(json.main, overrides[json.name].main);
      });

      stream.on('end', done);

      writeToStream(stream, fs.readFileSync('./fixtures/bower-marionette.json'));
    });

    it('should load overrides from file if value is string', function(done) {
      var overrides = './fixtures/overrides.json';

      var stream = bowerOverrides({overrides: overrides});

      stream.on('data', function (file) {
        var json = parseJson(file);
        assert.strictEqual(json.main, require(overrides)[json.name].main);
      });

      stream.on('end', done);

      writeToStream(stream, fs.readFileSync('./fixtures/bower-marionette.json'));
    });
  });
});
