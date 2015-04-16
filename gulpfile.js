var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    webserver = require('gulp-webserver'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    riotify = require('riotify'),
    del = require('del');

gulp.task('clean', function(cb) {
    del(['build/*.*'], cb);
});

gulp.task('styles', function() {
    return gulp.src('./src/main.css')
        .pipe(gulp.dest('./build/'))
        .pipe(notify({message:'Styles built'}));
});

gulp.task('scripts', function() {
    return browserify()
        .add('./src/index.js')
        .transform('riotify', {ext: 'html'})
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('./build/'))
        .pipe(notify({message:'Scripts built'}));
});

gulp.task('watch', function() {
    gulp.watch('./src/*.css', ['styles']);
    gulp.watch(['./src/**/*.js', './src/**/*.html'], ['scripts']);
    livereload.listen();
    gulp.watch(['./build/**']).on('change', livereload.changed);
});

gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});

gulp.task('default', function() {
    gulp.start('clean', 'styles', 'scripts', 'watch', 'webserver');
});
