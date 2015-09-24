var through = require('through2');
var gutil = require('gulp-util');
var Path = require('path');
var missed  = require('./missed.json');

const PLUGIN_NAME = 'gulp-bootstrap-configurator';

function makeBootstrap(configText, callback) {
    var data = [];
    var config = JSON.parse(configText);

    for (var type in missed)
      for (var name in missed[type])
        config[type][name] = missed[type][name];

    for (var name in config.vars)
        data.push(name + ':  ' + config.vars[name] + ";");

    for (var i in config.css)
        data.push('@import "' + config.css[i] + "\"");

    callback(null, data.join("\n") + "\n");
}

module.exports = function(destName) {
  return through.obj(function (file, encoding, callback){
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new gutil.PluginError(PLUGIN_NAME, 'doesn\'t support Streams'));
    }

    makeBootstrap(file.contents.toString(), function (err, data) {
      if (err) {
        return callback(new gutil.PluginError(PLUGIN_NAME, err));
      }

      file.contents = new Buffer(data);
      file.path = Path.join(file.base, destName)
      callback(null, file);
    });
  });
}
