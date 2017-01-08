# gulp-bootstrap-configurator
Build bootstrap with your own configuration file. You can make your own 'config.json' with online tool [http://getbootstrap.com/customize/](http://getbootstrap.com/customize/)

### Installation
Install `gulp-bootstrap-configurator` via `npm`:
```
npm install --save-dev gulp-bootstrap-configurator
```

### Usage
Bootstrap should be installed in your project (via npm or bower).

Insert into your gulpfile

```javascript
var bsConfig = require("gulp-bootstrap-configurator");

// For CSS
gulp.task('make-bootstrap-css', function(){
  return gulp.src("./config.json")
    .pipe(bsConfig.css())
    .pipe(gulp.dest("./assets"));
    // It will create `bootstrap.css` in directory `assets`.
});

// For JS
gulp.task('make-bootstrap-js', function(){
  return gulp.src("./config.json")
    .pipe(bsConfig.js())
    .pipe(gulp.dest("./assets"));
    // It will create `bootstrap.js` in directory `assets`.
});
```

### Options
* `bower: true` - if bootstrap installed via bower
* `compress: true` - will create `bootstrap.min.{js,css}`
* `name: 'destFile.{js,css}'` - name of destination file

For example

```javascript
gulp.task('make-bootstrap-js', function(){
  return gulp.src("./config.json")
    .pipe(bsConfig.js({
      compress: true,
      bower: true,
      name: 'my.js'
    }))
    .pipe(gulp.dest("./assets"));
    // It will create compressed `my.js` in directory `assets`.
});
```
