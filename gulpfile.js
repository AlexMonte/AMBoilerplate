
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const uglify = require('gulp-uglify');
const lineec = require('gulp-line-ending-corrector');
const browsersync = require('browser-sync').create();
const reload = browsersync.reload;

let src = './src/',
    srcjs = src + 'js/',
    srcscss = src + 'sass/',
    root = './app/',
    scss = root + 'css/',
    js   = root + 'javascript/';

let CSSwatch = src + 'scss/main.scss',
    HTMLwatch= root + '*.html'
    JSwatch  = [
      srcjs + 'app.js'
    ];

let imgsrc = src + "assets/images/",
    imgdest= root + 'assets/images/' ;

function css() {
  return gulp.src([srcscss + 'main.scss'])
  .pipe(sourcemaps.init({loadMaps:true, largeFile:true}))
  .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(autoprefixer('last 2 versions'))
  .pipe(sourcemaps.write())
  .pipe(lineec())
  .pipe(gulp.dest(scss + '/DEBUG/'))
}
 function cssConcat(){
   return gulp.src(scss + '/DEBUG/main.css')
   .pipe(sourcemaps.init({loadMaps:true, largeFile:true}))
   .pipe(concat('main.min.css'))
   .pipe(cleanCSS())
   .pipe(sourcemaps.write('./maps/'))
   .pipe(lineec())
   .pipe(gulp.dest(scss))
   .pipe(browsersync.stream());
 }

function javascript(){
  return gulp.src(JSwatch)
  .pipe(concat('app.js'))
  .pipe(uglify())
  .pipe(lineec())
  .pipe(gulp.dest(js));
}

function imgmin() {
  return gulp.src(imgsrc)
  .pipe(changed(imgdest))
  .pipe(imagemin([
    imagemin.gifsicle({interlaced:true}),
    imagemin.jpegtran({progressive:true}),
    imagemin.optipng({optimizationLevel:5})
  ]))
  .pipe(gulp.dest(imgdest));
}

function watch() {
  browsersync.init({
    open: false,
    port: 8080,
    server: {
      baseDir:'./app',
      index: 'index.html'}
     
  });
  gulp.watch(srcscss, gulp.series([css,cssConcat]));
  gulp.watch(srcjs, javascript);
  gulp.watch(imgsrc, imgmin);
  gulp.watch([HTMLwatch, js + 'app.js', scss + 'main.min.css']).on('change', reload);
} 

exports.css = css;
exports.cssConcat = cssConcat;
exports.javascript = javascript;
exports.watch = watch;
exports.imgmin = imgmin

let build = gulp.parallel(watch)

gulp.task('default', build)