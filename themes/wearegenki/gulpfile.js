'use strict';

// NOTE: Hugo must be installed to /usr/local/bin/hugo

// Tools
const gulp = require('gulp');
const del = require('del');
const exec = require('child_process').exec;
const gutil = require('gulp-util');
const notifier = require('node-notifier');
const gulpif = require('gulp-if');
// Icons
const svgmin = require('gulp-svgmin');
const iconfont = require('gulp-iconfont');
const runTimestamp = Math.round(Date.now() / 1000);
const consolidate = require('gulp-consolidate');
// CSS
// const sourcemaps = require('gulp-sourcemaps'); // Enable for development
const sass = require('gulp-sass');
const uncss = require('gulp-uncss');
const autoprefixer = require('gulp-autoprefixer');
const cmq = require('gulp-group-css-media-queries');
const nano = require('gulp-cssnano');
const csso = require('gulp-csso');
// JS
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
// Minification
const gzip = require('gulp-gzip');
const htmlmin = require('gulp-htmlmin');
const md5 = require('gulp-md5-plus');

//----------------------------------------

// DEV BUILD

let production = false;

// Clean files from prior build
gulp.task('init-clean', (fetch) =>
  // Native rm so we can use sudo (needed due to permissions)
  exec('sudo rm -rf ../../public/', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    fetch(err);
  })
);

// Initialise hugo
gulp.task('init-hugo', ['init-clean'], (fetch) =>
  exec('/usr/local/bin/hugo -s ../../', (err, stdout, stderr) => {
    console.log(stdout); // See Hugo output
    console.log(stderr); // Debugging feedback
    fetch(err);
  })
);

// Create icon font from SVG images
gulp.task('icon-font', () =>
  // FIXME: Only run on production builds for faster dev builds
  // if (production) {}
  gulp.src(['./static/images/icons/*.svg'])
    .pipe(svgmin())
    .pipe(iconfont({
      fontName: 'icons',
      formats: ['ttf', 'eot', 'woff', 'woff2'],
      appendUnicode: false,
      timestamp: runTimestamp, // recommended to get consistent builds when watching files
    }))
    .on('glyphs', (glyphs, options) => {
      console.log(glyphs, options); // Uncomment for debugging
      return gulp.src('./scss/templates/_icons.scss')
        .pipe(consolidate('lodash', {
          glyphs,
          fontName: 'icons',
          fontPath: '/fonts/',
          className: 'i',
        }))
      .pipe(gulp.dest('./scss/'));
    })
    .pipe(gulp.dest('./static/fonts'))
);

// Compile SCSS and process resulting CSS
gulp.task('css', ['init-hugo', 'icon-font'], () =>
  gulp.src(['./scss/theme.scss', './scss/ie.scss'])
    // .pipe(sourcemaps.init())     // Enable for development
      .pipe(sass())
    // .pipe(sourcemaps.write('.')) // Enable for development
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
        /\.is-exiting/,
      ],
      ignoreSheets: [/fonts.googleapis/],
    })))
    .pipe(gulpif(production, cmq({
      // log: true // See which media queries where processed
    })))
    .pipe(gulpif(production, autoprefixer({
      browsers: ['> 1% in AU'],
      cascade: false,
    })))
    .pipe(gulpif(production, nano())) // New experimental minification
    .pipe(gulpif(production, csso())) // Exelent CSS minification
    .pipe(gulp.dest('./static/css'))
);

// Minify JS
gulp.task('js', () =>
  gulp.src([
    './static/js/bootstrap/dropdown.js',
    './static/js/bootstrap/collapse.js',
    './static/js/bootstrap/transition.js',
    './static/js/jquery.smoothState.min.js',
    './static/js/init.js',
  ])
    .pipe(concat('all.js'))
    .pipe(gulpif(production, uglify()))
    .pipe(gulp.dest('./static/js'))
);

// Run Hugo to copy finished files over to public folder
gulp.task('hugo', ['css', 'js'], (fetch) =>
  exec('/usr/local/bin/hugo -s ../../', (err, stdout, stderr) => {
    console.log(stdout); // See Hugo output
    console.log(stderr); // Debugging feedback
    fetch(err);
  })
);

// Default task
gulp.task('default', ['hugo'], () => {
  // Do dev build tasks then notify completion
  notifier.notify({ title: 'Gulp', message: 'DEV build complete.', time: 120 });
  gutil.beep();
});

//----------------------------------------

// PRODUCTION BUILD

// Minify HTML
gulp.task('html', ['hugo'], () =>
  gulp.src('../../public/**/*.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      preserveLineBreaks: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      keepClosingSlash: false,
      minifyJS: true,
    }))
    .pipe(gulp.dest('../../public'))
);

gulp.task('version-icons', ['html'], () =>
  gulp.src('../../public/fonts/icons.*')
    .pipe(md5(5, '../../public/css/*.css'))
    .pipe(gulp.dest('../../public/fonts'))
);

gulp.task('version-css', ['version-icons'], () =>
  gulp.src('../../public/css/*.css')
    .pipe(md5(5, '../../public/**/*.html'))
    .pipe(gulp.dest('../../public/css'))
);

gulp.task('version-js', ['html'], () =>
  gulp.src('../../public/js/all.js')
    .pipe(md5(5, '../../public/**/*.html'))
    .pipe(gulp.dest('../../public/js'))
);

// Once Hugo copies files over, clean up residual source files
gulp.task('clean', ['version-css', 'version-js'], (cb) =>
  del([
    '../../public/js/bootstrap/',
    '../../public/js/jquery.particleground.min.js',
    '../../public/js/jquery.smoothState.min.js',
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
    '../../public/fonts/icons.svg',     // By-product of icon generation
  ], ({ force: true }), cb) // Need to force because it's outside the source directory
);

gulp.task('zip', ['clean'], () =>
  gulp.src(['../../public/**/*.html', '../../public/sitemap.xml', '../../public/**/*.css', '../../public/**/*.js', '../../public/favicon.ico'])
    .pipe(gzip({
      threshold: 152,
      gzipOptions: { level: 9 },
    }))
    .pipe(gulp.dest('../../public'))
);

// Adjust file permissions so everything is ready to go on the server
gulp.task('permissions', ['zip'], (fetch) => {
  exec('find ../../public/* -type d -exec chmod 550 {} \\; && find ../../public/* -type f -exec chmod 440 {} \\; && sudo find ../../public -exec chown 33:33 {} \\;', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    fetch(err);
  });
});

gulp.task('set-prod', () => {
  // Set a flag to run production level modules
  production = true;
});

// Production task
gulp.task('production', ['set-prod', 'permissions'], () => {
  gutil.log('production =', gutil.colors.red(production)); // Debugging

  // Do production tasks then notify completion
  notifier.notify({ title: 'Gulp', message: 'PRODUCTION build complete.', time: 120 });
  gutil.beep();
});

// Alias of production for ease of use
gulp.task('p', ['production'], () => {});

//----------------------------------------

// Standalone hugo
gulp.task('just-hugo', (fetch) =>
  exec('/usr/local/bin/hugo -s ../../', (err, stdout, stderr) => {
    console.log(stdout); // See Hugo output
    console.log(stderr); // Debugging feedback
    fetch(err);
    notifier.notify({ title: 'Gulp', message: 'HUGO ONLY complete.', time: 120 });
  })
);

// Watch for changes
gulp.task('watch', () => {
  gulp.watch(['./scss/**/*.scss', '!./scss/_icons.scss', './static/js/**/*.js'], ['default']);
  // Don't watch here instead use: sudo hugo server -w -D
  // gulp.watch('../../content/**/*.md', ['just-hugo']);
});
