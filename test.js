'use strict';

var fs = require('fs');
var assert = require('assert');
var gutil = require('gulp-util');
var bowerOverrides = require('./');

var mainBowerJson = require('./bower.json');

describe('gulp-bower-overrides', function() {
  it('should merge overrides block into bower.json src', function(done) {
		var stream = bowerOverrides();

		stream.on('data', function (file) {
			var json = JSON.parse(file.contents.toString());
			assert.strictEqual(json.main, mainBowerJson.overrides[json.name].main);
		});

		stream.on('end', done);

		stream.write(new gutil.File({
			base: __dirname,
			path: __dirname + '/bower.json',
			contents: fs.readFileSync('./fixtures/bower-marionette.json')
		}));

		stream.end();

  });
});
