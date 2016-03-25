"use strict";

// Tools
var gulp = require('gulp');
var del = require('del');
var exec = require('child_process').exec;
var gutil = require('gulp-util');
var notifier = require('node-notifier');
var gulpif = require('gulp-if');
// Icons
var svgmin = require('gulp-svgmin');
var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now()/1000); // Recommended by gulp-iconfont for 'watch', what's it for and could it be used by other tasks?
var consolidate = require('gulp-consolidate');
// CSS
//var sourcemaps = require('gulp-sourcemaps'); // Enable for development
var sass = require('gulp-sass');
var uncss = require('gulp-uncss');
var autoprefixer = require('gulp-autoprefixer');
var cmq = require('gulp-group-css-media-queries');
var nano = require('gulp-cssnano');
var csso = require('gulp-csso');
// JS
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
// Minification
var gzip = require('gulp-gzip');
var htmlmin = require('gulp-htmlmin');
var md5 = require("gulp-md5-plus");

//----------------------------------------

// DEV BUILD

var production = false;

// Clean files from prior build
gulp.task('init-clean', function(fetch) {
  // Native rm so we can use sudo (needed due to permissions)
  return exec('sudo rm -rf ../../public/', function (err, stdout, stderr) {
    // console.log(stdout);
    // console.log(stderr);
    fetch(err);
  });
});

// Initialise hugo
gulp.task('init-hugo', ['init-clean'], function(fetch) {
  return exec('hugo -s ../../', function (err, stdout, stderr) {
    // console.log(stdout); // See Hugo output
    // console.log(stderr); // Debugging feedback
    fetch(err);
  });
})

// Create icon font from SVG images
gulp.task('icon-font', function(){
  // Only run on production builds for faster dev builds
  if (production) {
    return gulp.src(['./static/images/icons/*.svg'])
      .pipe(svgmin())
      .pipe(iconfont({
        fontName: 'icons',
        formats: ['ttf', 'eot', 'woff', 'woff2'],
        appendUnicode: false,
        timestamp: runTimestamp, // recommended to get consistent builds when watching files
      }))
      .on('glyphs', function(glyphs, options) {
        // console.log(glyphs, options); // Uncomment for debugging
        return gulp.src('./scss/templates/_icons.scss')
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            fontName: 'icons',
            fontPath: '/fonts/',
            className: 'i'
        }))
        .pipe(gulp.dest('./scss/'));
      })
      .pipe(gulp.dest('./static/fonts'));
  }
});

// Compile SCSS and process resulting CSS
gulp.task('css', ['init-hugo', 'icon-font'], function() {
  return gulp.src(['./scss/theme.scss', './scss/ie.scss'])
    //.pipe(sourcemaps.init())     // Enable for development
      .pipe(sass())
    //.pipe(sourcemaps.write('.')) // Enable for development, but also comment out bellow optimisations
    .pipe(gulpif(production, uncss({
      html: ['../../public/**/*.html'],
      ignore: [
        '.fade',
        '.fade.in',
        '.collapse',
        '.collapse.in',
        '.collapsing',
        // /\.open\s(>\s)?\.dropdown-menu/, // Refined version bellow, this is a backup
        '.open > .dropdown-menu',
        /^((#hero-home )?\.navbar-default )?\.navbar-nav \.open\s(>\s)?\.dropdown-menu((?! \.(dropdown-header|disabled)).)*$/,
        /\.is-exiting/
      ],
      ignoreSheets: [/fonts.googleapis/]
    })))
    .pipe(gulpif(production, cmq({
      // log: true // See which media queries where processed
    })))
    .pipe(gulpif(production, autoprefixer({
      browsers: ['> 5% in AU'],
      cascade: false
    })))
    .pipe(gulpif(production, nano())) // New experimental minification
    .pipe(gulpif(production, csso())) // Exelent CSS minification
    .pipe(gulp.dest('./static/css'));
});

// Minify JS
gulp.task('js', function() {
  return gulp.src([
    './static/js/bootstrap/dropdown.js',
    './static/js/bootstrap/collapse.js',
    './static/js/bootstrap/transition.js',
    './static/js/jquery.smoothState.js',
    './static/js/init.js'
    ])
    .pipe(concat('all.js'))
    .pipe(gulpif(production, uglify()))
    .pipe(gulp.dest('./static/js'));
});

// Run Hugo to copy finished files over to public folder
gulp.task('hugo', ['css', 'js'], function(fetch) {
  return exec('hugo -s ../../', function(err, stdout, stderr) {
    // console.log(stdout); // See Hugo output
    // console.log(stderr); // Debugging feedback
    fetch(err);
  });
})

// Default task
gulp.task('default', ['hugo'], function() {
  // Do dev build tasks then notify completion
  notifier.notify({ title: 'Gulp', message: 'DEV build complete.', time: 120 });
  gutil.beep();
});

//----------------------------------------

// PRODUCTION BUILD

// Minify HTML
gulp.task('html', ['hugo'], function() {
  return gulp.src('../../public/**/*.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      preserveLineBreaks: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      keepClosingSlash: false,
      minifyJS: true // FIXME: Causes the preserveLineBreaks option to not work after script tags
    }))
    .pipe(gulp.dest('../../public'));
});

gulp.task('version-icons', ['html'], function() {
  return gulp.src('../../public/fonts/icons.*')
    .pipe(md5(5, '../../public/css/*.css'))
    .pipe(gulp.dest("../../public/fonts"));
});

gulp.task('version-css', ['version-icons'], function() {
  return gulp.src('../../public/css/*.css')
    .pipe(md5(5, '../../public/**/*.html'))
    .pipe(gulp.dest("../../public/css"));
});

gulp.task('version-js', ['html'], function() {
  return gulp.src('../../public/js/all.js')
    .pipe(md5(5, '../../public/**/*.html'))
    .pipe(gulp.dest("../../public/js"));
});

// Once Hugo copies files over, clean up residual source files
gulp.task('clean', ['version-css', 'version-js'], function(cb) {
  return del([
    '../../public/js/bootstrap/',
    '../../public/js/jquery.particleground.min.js',
    '../../public/js/jquery.smoothState.js',
    '../../public/js/init.js',
    '../../public/fonts/icons.eot',     // Use versioned file instead
    '../../public/fonts/icons.ttf',     // Use versioned file instead
    '../../public/fonts/icons.woff',    // Use versioned file instead
    '../../public/fonts/icons.woff2',   // Use versioned file instead
    '../../public/css/ie.css',          // Use versioned file instead
    '../../public/js/all.js',           // Use versioned file instead
    '../../public/css/theme.css',       // Use versioned file instead
    '../../public/css/theme.css.map',
    '../../public/css/ie.css.map',
    '../../public/images/icons/',
    '../../public/fonts/icons.svg'     // By-product of icon generation
  ], ({force: true}), cb); // Need to force because it's outside the source directory
});

gulp.task('zip', ['clean'], function() {
  return gulp.src(['../../public/**/*.html', '../../public/sitemap.xml', '../../public/**/*.css', '../../public/**/*.js', '../../public/favicon.ico'])
    .pipe(gzip({
      threshold: 152,
      gzipOptions: {level: 9}
    }))
    .pipe(gulp.dest('../../public'));
});

// Adjust file permissions so everything is ready to go on the server
gulp.task('permissions', ['zip'], function(fetch) {
  exec('find ../../public/* -type d -exec chmod 550 {} \\; && find ../../public/* -type f -exec chmod 440 {} \\; && sudo find ../../public -exec chown 1010:33 {} \\;', function (err, stdout, stderr) {
    // console.log(stdout);
    // console.log(stderr);
    fetch(err);
  });
})

gulp.task('set-prod', function() {
  // Set a flag to run production level modules
  production = true;
})

// Production task
gulp.task('production', ['set-prod', 'permissions'], function() {
  //gutil.log('production =', gutil.colors.red(production)); // Debugging

  // Do production tasks then notify completion
  notifier.notify({ title: 'Gulp', message: 'PRODUCTION build complete.', time: 120 });
  gutil.beep();
});

// Alias of production for ease of use
gulp.task('p', ['production'], function(){});

//----------------------------------------

// Standalone hugo
gulp.task('just-hugo', function(fetch) {
  return exec('hugo -s ../../', function(err, stdout, stderr) {
    // console.log(stdout); // See Hugo output
    // console.log(stderr); // Debugging feedback
    fetch(err);
  });
  notifier.notify({ title: 'Gulp', message: 'HUGO ONLY complete.', time: 120 });
})

// Watch for changes
gulp.task('watch', function() {
  gulp.watch(['./scss/**/*.scss', '!./scss/_icons.scss', './static/js/**/*.js'], ['default']);
  // Don't watch here instead use: sudo hugo server -w -D
  //gulp.watch('../../content/**/*.md', ['just-hugo']);
});
