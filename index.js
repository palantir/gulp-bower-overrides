'use strict';

var map = require('through2-map');
var gutil = require('gulp-util');
var extend = require('extend');

function loadBowerJson(options) {
	if (options.bowerContents) {
		return options.bowerContents;
	}
	var bowerPath = options.bowerPath || './bower.json';
	return require(bowerPath);
}

module.exports = function (options) {
	options = options || {};

	var bowerOverrides = loadBowerJson(options).overrides;

	if (!bowerOverrides) { return gutil.noop(); }

	return map.obj(function (file) {
		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-bower-overrides', 'Streaming not supported'));
		}

		try {
			var json = JSON.parse(file.contents.toString());
			extend(json, bowerOverrides[json.name]);
			file.contents = new Buffer(JSON.stringify(json));
			return file;
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-bower-overrides', err));
		}
	});
};
