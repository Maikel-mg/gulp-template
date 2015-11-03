var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css');
    uglify = require('gulp-uglify');

gulp.task('default', function (){
  return gulp.src('src/*.js')
    //.pipe(minifyCSS())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
    .pipe(babel({
            presets: ['babel-preset-es2015']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch('src/*.js', 'default');
});
