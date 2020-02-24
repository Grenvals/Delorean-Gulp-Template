const gulp = require('gulp'); // Инициализируем gulp 
// var plumber = require('gulp-plumber'); // Отслеживание ошибок без остановки
var tinypng = require('gulp-tinypng-compress'); // сжатие изображений
var concat  = require('gulp-concat'); // обэдинение файлов
var uglify = require('gulp-uglify'); // минификация скриптов

var sourcemaps = require('gulp-sourcemaps'),
    sass       = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		cleancss      = require('gulp-clean-css');


// Изображения 
  gulp.task('imgDev',  function() {
		return gulp.src(['./src/img/**/*', '!./src/img/svg/**/*' ])
    .pipe(gulp.dest('build/img/'));
	});

	gulp.task('imgBuild',  function() {
		return gulp.src(['./src/img/**/*', '!./src/img/svg/**/*' ])
		.pipe(tinypng({
			key: '78UEHTVIN19cuH3B5ZsGUaTWJ6Vsv3Ev',
			sigFile: 'src/img/.tinypng-sigs',  // создает лог, чтобы исключить повторения файлов которые сжимались
			log: true
	   }))
    .pipe(gulp.dest('build/img/'));
	});

	gulp.task('fonts',  function() {
		return gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('build/fonts/'));
	});

// Скрипты 
	gulp.task('libsDev', function() {
		return gulp.src([
			'./src/js/libs/**/*', 
			'!./src/js/scripts.js',
			// 'node_modules/owl.carousel2/dist/owl.carousel.min.js'
		 ])
		.pipe(sourcemaps.init())
		.pipe(concat('libs.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('build/js'));
	});

	gulp.task('libsBuild', function() {
		return gulp.src([
			'./src/js/libs/**/*', 
			'!./src/js/scripts.js',
		 ])
		.pipe(concat('libs.js'))
		.pipe(uglify())
    .pipe(gulp.dest('build/js'));
	});

	gulp.task('scriptsDev',  function() {
		return gulp.src(['./src/js/scripts.js'])
    .pipe(gulp.dest('build/js'));
	});

	gulp.task('scriptsBuild', function() {
		return gulp.src(['./src/js/scripts.js'])
		.pipe(uglify())
    .pipe(gulp.dest('build/js'));
	});

	// Styles 
	gulp.task('stylesDev', function() {
		return gulp.src(['./src/sass/style.scss'])
				.pipe(sourcemaps.init())
				.pipe(sass())
				.pipe(autoprefixer({
						overrideBrowserslist:  ['last 10 versions']
				}))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest('build/css/'));
	});
	
	gulp.task('stylesBuild', function() {
		return gulp.src(['./src/sass/style.scss'])
				.pipe(sass({outputStyle: 'compressed'}))
				.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
				.pipe(autoprefixer({
						overrideBrowserslist:  ['last 10 versions']
				}))
				.pipe(gulp.dest('build/css/'));
  });

