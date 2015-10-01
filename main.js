var through = require('through2');
var gutil = require('gulp-util');
var Path = require('path');
var fs = require('fs');
var less = require('less');
var uglify = require("uglify-js");
var missed  = require('./missed.json');

const PLUGIN_NAME = 'gulp-bootstrap-configurator';
var sequence = ["mixins", "normalize", "print", "glyphicons", "scaffolding", "type", "code", "grid", "tables", "forms", "buttons", "component-animations", "dropdowns", "button-groups", "input-groups", "navs", "navbar", "breadcrumbs", "pagination", "pager", "labels", "badges", "jumbotron", "thumbnails", "alerts", "progress-bars", "media", "list-group", "panels", "responsive-embed", "wells", "close", "modals", "tooltip", "popovers", "carousel", "utilities", "responsive-utilities"];
var js_seq = ["transition", "alert", "button", "carousel", "collapse", "dropdown", "modal", "tooltip", "popover", "scrollspy", "tab", 'affix'];

function makeBootstrap(configText, type, callback) {
    var data = [];
    var config = JSON.parse(configText);

    if (type == 'css') {
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
      data = data.join("\n");
    }

    if (type == 'js') {
      js_seq.forEach(function(name, i){
        name = name + '.js';
        if (config.js.indexOf(name) > -1) data.push(name);
      });
    }

    callback(null, data);
}

function constructor(type) {
  return function(opt) {
    opt = opt || {};
    opt.bower = opt.bower || false;
    opt.path = 'node_modules/bootstrap';
    if (opt.bower) opt.path = 'bower_components/bootstrap';
    if (! opt.base) opt.base = Path.dirname(module.parent.filename);

    opt.compress = opt.compress || false;
    if (! opt.name && opt.compress) opt.name = 'bootstrap.min.'+type;
    if (! opt.name) opt.name = 'bootstrap.'+type;


    return through.obj(function (file, encoding, callback){
      if (file.isNull()) {
        return callback(null, file);
      }

      if (file.isStream()) {
        return callback(new gutil.PluginError(PLUGIN_NAME, 'doesn\'t support Streams'));
      }

      makeBootstrap(file.contents.toString(), type, function (err, data) {
        if (err) {
          return callback(new gutil.PluginError(PLUGIN_NAME, err));
        }

        var bsDir = Path.join(opt.base, opt.path);

        if (type == 'css') {
          var lessDir = Path.join(bsDir, 'less');
          var cssFile = new gutil.File({
            base: opt.base,
            path: Path.join(file.base, opt.name),
            cwd: file.cwd,
          });

          less.render(data, {paths: [lessDir], compress: opt.compress}, function (e, output) {
            cssFile.contents = new Buffer(output.css);
            callback(null, cssFile);
          });
        }

        if (type == 'js') {
          var jsDir = Path.join(bsDir, 'js');
          var jsFile = new gutil.File({
            base: opt.base,
            path: Path.join(file.base, opt.name),
            cwd: file.cwd,
          });

          data.forEach(function(name, i){ data[i] = Path.join(jsDir, name) });
          data.unshift(Path.join(__dirname, 'header.js'));

          if (opt.compress) {
            jsFile.contents = new Buffer(uglify.minify(data).code);
          } else {
            var jsData = data.map(function(filePath){
              return fs.readFileSync(filePath);
            });
            jsFile.contents = new Buffer(jsData.join("\n"));
          }

          callback(null, jsFile);
        }
      });
    });
  }
}

module.exports = {
  css: constructor('css'),
  js: constructor('js')
};
