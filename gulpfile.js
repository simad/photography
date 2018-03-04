'use strict';

var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var fs = require('fs');
var tap = require('gulp-tap');
var path = require('path');

gulp.task('examples', function() {
  return gulp.src('./examples/*.html')
  .pipe(debug())
  .pipe(gulp.dest('./build'));
});

function createPhotoFile (name) {
  fs.writeFile('_photos/' + name + '.md', '---\nsection: 0\nfilename: ' + name + '\n---');
}

gulp.task('resize', function () {
    return gulp.src('images/*.*')
        .pipe(tap(function(file, t) {
          createPhotoFile(path.basename(file.path))
        }))
        .pipe(imageResize({
            width: 1024,
            imageMagick: true
        }))
        .pipe(gulp.dest('images/fulls'))
        .pipe(imageResize({
            width: 512,
            imageMagick: true
        }))
        .pipe(gulp.dest('images/thumbs'));
});

gulp.task('del', ['resize'], function () {
    return del(['images/*.*']);
});

// compile scss to css
gulp.task('sass', function () {
    return gulp.src('./assets/sass/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({basename: 'main.min'}))
        .pipe(gulp.dest('./assets/css'));
});

// watch changes in scss files and run sass task
gulp.task('sass:watch', function () {
    gulp.watch('./assets/sass/**/*.scss', ['sass']);
});

// minify js
gulp.task('minify-js', function () {
    return gulp.src('./assets/js/main.js')
        .pipe(uglify())
        .pipe(rename({basename: 'main.min'}))
        .pipe(gulp.dest('./assets/js'));
});

// default task
gulp.task('default', ['del']);

// scss compile task
gulp.task('compile-sass', ['sass', 'minify-js']);