"use strict";

var gulp = require('gulp'); // Инициализируем gulp 


var browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    // Отслеживание ошибок без остановки
del = require('del'),
    // IMG ---------------------------------------------------------------------
tinypng = require('gulp-tinypng-compress'),
    // сжатие изображений
imagemin = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    newer = require('gulp-newer'),
    // JS ---------------------------------------------------------------------
rigger = require('gulp-rigger'),
    // обэдинение в определенной последовательности:  //= folder/file.js
concat = require('gulp-concat'),
    // обэдинение файлов
uglify = require('gulp-uglify'),
    // минификация скриптов
// SASS ---------------------------------------------------------------------
sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css'),
    // PUG ---------------------------------------------------------------------
pug = require('gulp-pug'),
    pugInheritance = require('gulp-pug-inheritance'),
    changed = require('gulp-changed'),
    cached = require('gulp-cached'),
    gulpif = require('gulp-if'),
    filter = require('gulp-filter'),
    // KIT ---------------------------------------------------------------------
kit = require('gulp-kit'),
    // SVG ---------------------------------------------------------------------
svgSprite = require('gulp-svg-sprite'),
    // собирает все файлы в спрайт sprite.svg#shopping-cart
svgmin = require('gulp-svgmin'),
    // минификация svg 
cheerio = require('gulp-cheerio'),
    // удаляет артибуты
replace = require('gulp-replace'),
    // чистим символы после предыдущего плагина
// ----------------------------------- CONFIGURATION --------------------------------------------
// BROWSERSYNC Configuration---------------------------------------------------------------------
BrowserSyncConfig = {
  server: {
    baseDir: "./build"
  },
  tunnel: false,
  host: 'localhost',
  port: 3000,
  notify: false,
  // open: false,
  online: false // Work Offline Without Internet Connection
  // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me

},
    // DIRECTORY -------------------------------------------------------------------------------------
filePath = {
  pug: {
    "in": './src/pug/*.pug',
    out: './build/'
  },
  kit: {
    "in": 'src/kit/*.kit',
    out: './build/'
  },
  sass: {
    "in": './src/sass/style.scss',
    out: 'build/css/',
    finalBuild: 'compressed'
  },
  jsLibs: {
    "in": [// './src/js/libs/*.js', 
    './src/js/libs/#AddLibs.js' // 'node_modules/owl.carousel2/dist/owl.carousel.min.js',
    ],
    out: 'build/js'
  },
  jsScripts: {
    "in": './src/js/*.js',
    out: 'build/js'
  },
  img: {}
}; // PUG ------------------------------------------------------------------


gulp.task('pug', function () {
  return gulp.src(filePath.pug["in"]).pipe(plumber()).pipe(changed('dist', {
    extension: '.html'
  })).pipe(gulpif(global.isWatching, cached('pug'))).pipe(pugInheritance({
    basedir: './src/pug/',
    skip: 'node_modules'
  })).pipe(filter(function (file) {
    return !/\/_/.test(file.path) && !/^_/.test(file.relative);
  })).pipe(pug({
    pretty: true
  })).pipe(plumber.stop()).pipe(gulp.dest(filePath.pug.out));
}); // KIT ------------------------------------------------------------------

gulp.task('kit', function () {
  return gulp.src('src/kit/*.kit').pipe(plumber()).pipe(kit()).pipe(gulp.dest('build/'));
}); // SASS ------------------------------------------------------------------

gulp.task('sassDev', function () {
  return gulp.src('./src/sass/style.scss').pipe(plumber()).pipe(sourcemaps.init()).pipe(sass().on('error', function (error) {
    console.log(error);
  })).pipe(autoprefixer({
    overrideBrowserslist: ['last 10 versions']
  })).pipe(sourcemaps.write('.')).pipe(gulp.dest('build/css/')).pipe(browserSync.stream());
});
gulp.task('sassBuild', function () {
  return gulp.src(['./src/sass/style.scss']).pipe(sass({
    outputStyle: 'compressed'
  })).pipe(cleancss({
    level: {
      1: {
        specialComments: 0
      }
    }
  })).pipe(autoprefixer({
    overrideBrowserslist: ['last 10 versions']
  })).pipe(gulp.dest('build/css/'));
}); // JS ------------------------------------------------------------------

gulp.task('libsDev', function () {
  return gulp.src(['./src/js/libs/*.js', './src/js/libs/#AddLibs.js' // 'node_modules/owl.carousel2/dist/owl.carousel.min.js',
  ]).pipe(plumber()).pipe(sourcemaps.init()).pipe(rigger()).pipe(concat('libs.js')).pipe(sourcemaps.write('.')).pipe(gulp.dest('build/js')).pipe(browserSync.stream());
});
gulp.task('libsBuild', function () {
  return gulp.src(['./src/js/libs/*.js', './src/js/libs/#AddLibs.js' // 'node_modules/owl.carousel2/dist/owl.carousel.min.js',
  ]).pipe(rigger()).pipe(concat('libs.js')).pipe(uglify()).pipe(gulp.dest('build/js'));
});
gulp.task('scriptsDev', function () {
  return gulp.src('./src/js/*.js').pipe(plumber()).pipe(gulp.dest('build/js')).pipe(browserSync.stream());
});
gulp.task('scriptsBuild', function () {
  return gulp.src(['./src/js/*.js']).pipe(uglify()).pipe(gulp.dest('build/js'));
}); // IMG ------------------------------------------------------------------

gulp.task('imgMover', function () {
  return gulp.src(['!./src/img/svg/', '!./src/img/_compress/', './src/img/**/*']).pipe(gulp.dest('build/img/'));
});
gulp.task('imgCompressMover', function () {
  return gulp.src(['!./src/img/_compress/*.tinypng-sigs', './src/img/_compress/**/*']).pipe(gulp.dest('build/img/'));
});
gulp.task('tinyPngHandler', function () {
  return gulp.src(['!./src/img/svg/', '!./src/img/_compress/', './src/img/**/*']).pipe(tinypng({
    key: '78UEHTVIN19cuH3B5ZsGUaTWJ6Vsv3Ev',
    sigFile: 'src/img/_compress/.tinypng-sigs',
    // создает лог, чтобы исключить повторения файлов которые сжимались
    log: true
  })).pipe(gulp.dest('./src/img/_compress/'));
});
gulp.task('imgOflineHandler', function () {
  return gulp.src(['!./src/img/svg/', '!./src/img/_compress/', './src/img/**/*']).pipe(newer('./build/img/')).pipe(imagemin([imagemin.gifsicle({
    interlaced: true
  }), imagemin.mozjpeg({
    progressive: true
  }), imageminJpegRecompress({
    loops: 5,
    min: 70,
    max: 75,
    quality: 'high'
  }), imagemin.svgo(), imagemin.optipng({
    optimizationLevel: 3
  }), pngquant([0.8, 0.8])], {
    verbose: true
  })).pipe(gulp.dest('./build/img/'));
}); // SVG ------------------------------------------------------------------

gulp.task('svg', function () {
  return gulp.src('./src/img/svg/*.svg').pipe(svgmin({
    js2svg: {
      pretty: true
    }
  })).pipe(cheerio({
    run: function run($) {
      $('[fill]').removeAttr('fill');
      $('[stroke]').removeAttr('stroke');
      $('[style]').removeAttr('style');
    },
    parserOptions: {
      xmlMode: true
    }
  })).pipe(replace('&gt;', '>')).pipe(svgSprite({
    mode: {
      symbol: {
        sprite: "sprite.svg"
      }
    }
  })).pipe(gulp.dest('./build/img/svg'));
}); // FONTS ------------------------------------------------------------------

gulp.task('fonts', function () {
  return gulp.src('./src/fonts/**/*').pipe(gulp.dest('build/fonts/')).pipe(browserSync.stream());
}); // CLEANER ------------------------------------------------------------------

gulp.task('clearBuild', function () {
  return del(['build/*']);
}); // WATCHER ------------------------------------------------------------------

gulp.task('watch', function () {
  browserSync.init(BrowserSyncConfig);
  gulp.watch('./src/**/*.pug', gulp.parallel('pug')).on('change', browserSync.reload); //PUG +

  gulp.watch('./src/**/*.kit', gulp.parallel('kit')).on('change', browserSync.reload); //KIT + 

  gulp.watch('./src/**/*.scss', gulp.parallel('sassDev')); //SASS +
  // gulp.watch('./src/img/**/*.{png,jpg,gif}', gulp.series('imgCompress', 'imgDev')); //IMG +
  // gulp.watch('./src/img/#compress/**/*.{png,jpg,gif}', gulp.parallel('imgDev')); //IMG +

  gulp.watch('./src/img/svg/*.svg', gulp.parallel('svg')); //SVG +

  gulp.watch('./src/js/*.js', gulp.parallel('scriptsDev')); //JS SCRIPTS +

  gulp.watch('./src/js/libs/*.js', gulp.parallel('libsDev')); //JS LIBS +
}); // TASKER ------------------------------------------------------------------

gulp.task('dev', gulp.series('clearBuild', // 'imgCompress',
gulp.parallel('pug', 'kit', 'sassDev', 'libsDev', 'scriptsDev', // 'imgDev',
'svg', 'fonts')));
gulp.task('build', gulp.series('clearBuild', 'pug', 'kit', 'sassBuild', 'libsBuild', 'scriptsBuild', // 'imgCompress',
// 'imgDev',
'svg', 'fonts'));
gulp.task('default', gulp.series('dev', gulp.parallel('watch')));