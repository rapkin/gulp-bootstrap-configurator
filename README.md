# gulp-bootstrap-configurator
Build bootstrap.css with your own configuration file

### Installation
Install `gulp-bootstrap-configurator` via `npm`:
```
npm install --save-dev gulp-bootstrap-configurator
```

### Usage
Insert into your gulpfile
```javascript
var bsConfig = require("gulp-bootstrap-configurator");

gulp.task('make-bootstrap', function(){
  gulp.src("./config.json")
    .pipe(bsConfig())
    .pipe(gulp.dest("./assets"));
});
```
It will create `bootstrap.css` in directory `assets`.
