'use strict';

var map = require('through2-map');
var gutil = require('gulp-util');
var extend = require('extend');

function loadBowerJson(options) {
  return require(options.bowerPath || process.cwd() + '/bower.json');
}

function getBowerOverrides(options) {
  // get overrides from options or bower.json file
  var overrides = options.overrides || loadBowerJson(options).overrides || {};
  // path to a .json file or inline object literal
  return (typeof overrides === 'string') ? require(overrides) : overrides;
}

// wrapper around map.obj that calls iterator function for each file with parsed JSON contents.
// iterator receives (file, json) arguments and returns new json content.
function mapJSON(iterator) {
  return map.obj(function(file) {
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-bower-overrides', 'Streaming not supported'));
    }

    try {
      var json = JSON.parse(file.contents.toString());
      json = iterator.call(this, file, json);
      file.contents = new Buffer(JSON.stringify(json, null, 2));
      return file;
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-bower-overrides', err));
    }
  });
}

// this is the plugin itself: merge overrides into each bower.json contents
function mergeBowerOverrides(options) {
  options = options || {};

  var bowerOverrides = getBowerOverrides(options);

  return mapJSON(function(file, json) {
    // get name of package from file path, but fallback to json
    var name = file.relative.substring(0, file.relative.indexOf('/')) || json.name;
    return extend(json, bowerOverrides[name]);
  });
}

// export mapJSON because it's kinda useful and fun
mergeBowerOverrides.mapJSON = mapJSON;

module.exports = mergeBowerOverrides;
