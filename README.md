# gulp-bootstrap-configurator
Build bootstrap.css with your own configuration file

### Usage
Insert into your gulpfile
```javascript
var bsConfig = require("gulp-bootstrap-configurator");

gulp.task('make-bootstrap', function(){
    gulp.src("./config.json")
        .pipe(bsConfig('bootstrap.less'))
        .pipe(gulp.dest("./assets"));
    }
}
```
