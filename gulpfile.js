var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var rimraf = require('rimraf');

gulp.task('clean', function(done) {
  rimraf('build', done);
});

gulp.task('styles', function() {
  return gulp.src('src/styles/*.scss')
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe(gulp.dest('build/styles'))
    .pipe($.csso())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('build/styles'))
    .pipe($.connect.reload());
});

gulp.task('scripts', function() {
  return gulp.src(['src/scripts/init.js', 'src/scripts/modules/*.js'])
    .pipe($.jshint())
    .pipe($.concat('scripts.js'))
    .pipe(gulp.dest('build/scripts'))
    .pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('build/scripts'))
    .pipe($.connect.reload());
});

gulp.task('html', function() {
  return gulp.src('src/**/[^_]*.jade')
    .pipe($.jade())
    .pipe(gulp.dest('build'))
    .pipe($.connect.reload());
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*.{svg,png,jpg,gif}')
    .pipe(gulp.dest('build/images'))
    .pipe($.connect.reload());
});

gulp.task('serve', ['build'], function(done) {
  $.connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('watch', ['build'], function() {
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/**/*.jade', ['html']);
});

gulp.task('build', ['styles', 'scripts', 'html', 'images']);

gulp.task('default', ['serve', 'watch']);
