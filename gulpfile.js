const gulp = require('gulp');

const env = process.env.NODE_ENV || 'prod';
const HTMLfiles = [
  'src/**/*.php',
  'src/**/*.html'
];
const JSfiles = [
  'src/**/*.js'
];
const dist = './public';
 
function html() {
  return gulp.src(HTMLfiles)
    .pipe(gulp.dest(dist))
}

function scripts() {
  return gulp.src(JSfiles)
    .pipe(gulp.dest(dist))
}

exports.default = gulp.series(html, scripts);