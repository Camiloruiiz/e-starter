import gulp from 'gulp'
import collect from 'gulp-rev-collector'
const config = require('../config').collect

/**
 * Replace all links to assets in files
 * from a manifest file
 */
export function revcollectPro() {
  return gulp.src(config.src)
    .pipe(collect({
      replaceReved: true
      /* dirReplacements: {
      'static/css/': 'static/css/',
      'static/js/': 'static/js/'
      } */
    }))
    .pipe(gulp.dest(config.dest))
}
