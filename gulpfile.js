var gulp = require('gulp')
// var gulpUtil = require('gulp-util')
var eslint = require('gulp-eslint')
var friendlyFormatter = require('eslint-friendly-formatter')
var nodemon = require('gulp-nodemon')

var jsFiles = ['*.js', '*/*.js']

gulp.task('style', function () {
  gulp.src(jsFiles)
        .pipe(eslint())
        .pipe(eslint.format(friendlyFormatter))
})

gulp.task('inject', function () {
  var wiredep = require('wiredep').stream
  var inject = require('gulp-inject')

  var injectSrc = gulp.src(['./public/stylesheets/*.css',
    './public/javascripts/*.js'], {
      read: false
    })

  var injectOptions = {
    ignorePath: '/public'
  }

  var options = {
    bowerJson: require('./bower.json'),
    directory: './public/lib',
    ignorePath: '../public'
  }
  return gulp.src('./views/*.ejs')
        .pipe(wiredep(options))
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./views'))
})

gulp.task('serve', ['style', 'inject'], function () {
  var options = {
    script: './bin/www',
    delayTime: 1,
    env: {
      'PORT': 3000
    },
    watch: jsFiles
  }
  return nodemon(options)
        .on('restart', function (ev) {
          console.log('Restarting...')
        })
})
