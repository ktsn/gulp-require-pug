# gulp-require-pug

Load pug into your JavaScript.

## Usage

```bash
$ npm install --save-dev gulp-require-pug
```

```js
const gulp = require('gulp')
const requirePug = require('gulp-require-pug')

gulp.task('scripts', () => {
  return gulp.src('src/**/*.js')
    .pipe(requirePug({
      // Any pug options are allowed here
      basedir: '/path/to/basedir',

      // Data should belong to `data`
      data: {
        hello: 'world'
      }
    }))
    .pipe(gulp.dest('dest'))
})
```

## License

MIT
