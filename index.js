'use strict';

var map = require('through2-map');
var path = require('path');
var glob = require('glob');
var extend = require('extend');

function loadProjectFile(filepath) {
  return require(path.join(process.cwd(), filepath));
}

function getBowerOverrides(options) {
  // get overrides from options or bower.json file
  var overrides = options.overrides || loadProjectFile(options.bowerPath).overrides || {};
  // path to a .json file or inline object literal
  return (typeof overrides === 'string') ? require(overrides) : overrides;
}

// expands `main` block (string or array of strings) with given cwd path
function expandGlobs(main, cwd) {
  if (!main) { return; }
  // expand each glob in main (coerce it to array first)
  var globs = [].concat(main).map(function(pattern) {
    return glob.sync(pattern, {cwd: cwd});
  });
  // flatten globs to single array
  return [].concat.apply([], globs);
}

// wrapper around map.obj that calls iterator function for each file with parsed JSON contents.
// iterator receives (file, json) arguments and returns new json content.
function mapJSON(iterator) {
  return map.obj(function(file) {
    if (file.isStream()) {
      this.emit('error', new Error('gulp-bower-overrides: Streaming not supported at this time.'));
    }

    try {
      var json = JSON.parse(file.contents.toString());
      json = iterator.call(this, json, file);
      file.contents = new Buffer(JSON.stringify(json, null, 2));
      return file;
    } catch (err) {
      this.emit('error', err);
    }
  });
}

// this is the plugin itself: merge overrides into each bower.json contents
function mergeBowerOverrides(options) {
  options = extend({
    bowerPath: 'bower.json',
    bowerComponentsPath: 'bower_components'
  }, options);

  var bowerOverrides = getBowerOverrides(options);

  return mapJSON(function(json, file) {
    // get name of package from file path, but fallback to json
    var name = file.relative.substring(0, file.relative.indexOf('/')) || json.name;

    extend(json, bowerOverrides[name]);

    if (options.expandGlobs) {
      var cwd = path.join(process.cwd(), options.bowerComponentsPath, name);
      json.main = expandGlobs(json.main, cwd);
    }

    return json;
  });
}

// export mapJSON because it's kinda useful and fun
mergeBowerOverrides.mapJSON = mapJSON;

module.exports = mergeBowerOverrides;
