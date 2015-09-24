var through = require('through2');
var gutil = require('gulp-util');
var Path = require('path');
var less = require('less');
var missed  = require('./missed.json');

const PLUGIN_NAME = 'gulp-bootstrap-configurator';
var sequence = ["mixins", "normalize", "print", "glyphicons", "scaffolding", "type", "code", "grid", "tables", "forms", "buttons", "component-animations", "dropdowns", "button-groups", "input-groups", "navs", "navbar", "breadcrumbs", "pagination", "pager", "labels", "badges", "jumbotron", "thumbnails", "alerts", "progress-bars", "media", "list-group", "panels", "responsive-embed", "wells", "close", "modals", "tooltip", "popovers", "carousel", "utilities", "responsive-utilities"];

function makeBootstrap(configText, callback) {
    var data = [];
    var config = JSON.parse(configText);

    config.css = config.css.concat(missed.css);
    for (var name in missed.vars)
        config.vars[name] = missed.vars[name];

    for (var name in config.vars)
        data.push(name + ':  ' + config.vars[name] + ";");

    sequence.forEach(function(name, i){
      name = name + '.less';
      if (config.css.indexOf(name) > -1)
        data.push('@import "' + name + "\";");
    });

    callback(null, data.join("\n"));
}

module.exports = function(opt) {
  opt = opt || {};
  opt.compress = opt.compress || false;
  opt.bower = opt.bower || false;
  if (! opt.base) opt.base = Path.dirname(module.parent.filename);
  if (! opt.name && opt.compress) opt.name = 'bootstrap.min.css';
  if (! opt.name) opt.name = 'bootstrap.css';
  if (! opt.path && opt.bower) opt.path = 'bower_components/bootstrap';
  if (! opt.path) opt.path = 'node_modules/bootstrap';

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

      var bsDir = Path.join(opt.base, opt.path, 'less');
      less.render(data, {paths: [bsDir], compress: opt.compress}, function (e, output) {
        file.contents = new Buffer(output.css);
        file.path = Path.join(file.base, opt.name)
        callback(null, file);
      });
    });
  });
}
