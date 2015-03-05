'use strict';

var map = require('through2-map');
var gutil = require('gulp-util');
var extend = require('extend');

function loadBowerJson(options) {
	return require(options.bowerPath || './bower.json');
}

function getBowerOverrides(options) {
	// get overrides from options or bower.json file
	var overrides = options.overrides || loadBowerJson(options).overrides || {};
	// path to a .json file or inline object literal
	return (typeof overrides === 'string') ? require(overrides) : overrides;
}

module.exports = function (options) {
	options = options || {};

	var bowerOverrides = getBowerOverrides(options);

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
