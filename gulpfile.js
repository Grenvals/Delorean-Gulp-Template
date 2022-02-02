//                   Gulp. Інструкція з керування пилососом, або як навести лад у квартирі.

// Коротше Жень. Уяви, що Gulp — це пилосос😊😊. З його допомогою ми можемо всмоктувати наші файли і відповідним чином їх обробляти.
// За допомогою методу .src() пилосос всмоктує файли, метод .pipe() — це труба пилососа, по якій ми послідовно(линейно) направляем нашу пыль(файлы) через различные фильтры од пыли(пропускаємо файли через різні npm пакети, які їх обробляють).
// Після того, як пил (файли) пройшов через фільтри, метод .dest() направляє нашу трубу в мішок для пилу(директория готового проекта).
// Також ми можемо навчити робота-пилососа прибирати квартиру (src) лише коли ми там наробили безлад(відстежувати зміни у файлах). Також у нас є різні пилососи, які ми вмикаємо залежно від того, наскільки ми хочемо чисту квартиру(запускати різні таски Gulp залежно від потреби). Коротше, успішного прибирання)

const gulp = require("gulp"); // Ініціалізуємо Gulp

let browserSync = require("browser-sync"),
  plumber = require("gulp-plumber"), // Усуває переривання тасків у разі помилки
  del = require("del"), // очищаємо непотрібні файли
  // IMG ---------------------------------------------------------------------
  tinypng = require("gulp-tinypng-compress"),
  imagemin = require("gulp-imagemin"), // дуже гнучкий і хороший набір офлайн, не хуже tinyPNG
  imageminJpegRecompress = require("imagemin-jpeg-recompress"),
  pngquant = require("imagemin-pngquant"),
  newer = require("gulp-newer"), // пропускає лише ті файли, яких немає в директорії
  // JS ---------------------------------------------------------------------
  rigger = require("gulp-rigger"), // конкатенація JS у заданій послідовності:  //= folder/file.js
  concat = require("gulp-concat"), // об'єднання файлів
  uglify = require("gulp-uglify"), // мініфікація
  // SASS ---------------------------------------------------------------------
  sourcemaps = require("gulp-sourcemaps"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  cleancss = require("gulp-clean-css"),
  // PUG ---------------------------------------------------------------------
  pug = require("gulp-pug"),
  // KIT ---------------------------------------------------------------------
  kit = require("gulp-kit"), // мені він сподобався) його перевага — компілюється миттєво, на відміну від Pug.
  // SVG ---------------------------------------------------------------------
  svgSprite = require("gulp-svg-sprite"), // збирає всі файли в спрайт sprite.svg#shopping-cart
  svgmin = require("gulp-svgmin"), // мініфікація svg
  cheerio = require("gulp-cheerio"), // видаляє атрибути
  replace = require("gulp-replace"), // очищає символи після попереднього плагіна
  // ----------------------------------- CONFIGURATION --------------------------------------------

  // BROWSERSYNC Configuration---------------------------------------------------------------------
  BrowserSyncConfig = {
    server: {
      baseDir: "./build",
    },
    tunnel: false,
    host: "localhost",
    port: 3000,
    notify: false,
    // open: false,
    online: false, // Work Offline Without Internet Connection
    // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
  },
  // DIRECTORY -------------------------------------------------------------------------------------
  filePath = {
    // Усі шляхи винесено у властивості об'єктів для швидкої зміни — це дозволяє швидко адаптуватися.
    pug: {
      in: "./src/pug/*.pug",
      out: "./build/",
    },
    kit: {
      in: "src/kit/*.kit",
      out: "./build/",
    },
    sass: {
      in: "./src/sass/style.scss",
      out: "build/css/",
    },
    jsLibs: {
      in: [
        // Точка входу. Конкатенує всі бібліотеки, вказані у файлі #AddLibs.js в заданой последовательности, или подключать напряму из пакетов ноды
        "./src/js/libs/#AddLibs.js",
        // './src/js/libs/*.js',
        // 'node_modules/owl.carousel2/dist/owl.carousel.min.js',
      ],
      out: "build/js",
    },
    jsScripts: {
      in: "./src/js/*.js",
      out: "build/js",
    },
    img: {
      in: ["src/img/**/*", "!src/img/svg/**/*", "!src/img/_compress/**/*"],
      out: "./build/img/",
      compImgCache: "./src/img/_compress/", // TinyPng Online
      tinyPngApiKey: "78UEHTVIN19cuH3B5ZsGUaTWJ6Vsv3Ev",
      // '*****************************',
    },
    svg: {
      in: "./src/img/svg/*.svg",
      out: "./build/img/svg",
    },
    fonts: {
      in: "./src/fonts/**/*",
      out: "build/fonts/",
    },
    cleaner: "build/*",
  };

// -------------------------------------- TASKS -------------------------------------------------
// PUG ------------------------------------------------------------------ +
gulp.task("pug", () => {
  return gulp
    .src(filePath.pug.in)
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(filePath.pug.out))
    .on("end", browserSync.reload);
});

// KIT ------------------------------------------------------------------ +
gulp.task("kit", () => {
  return gulp
    .src(filePath.kit.in)
    .pipe(plumber())
    .pipe(kit())
    .pipe(gulp.dest(filePath.kit.out))
    .on("end", browserSync.reload);
});

// SASS ------------------------------------------------------------------ +
gulp.task("sassDev", () => {
  return gulp
    .src(filePath.sass.in)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass().on("error", function (error) {
        console.log(error);
      })
    )
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 versions"] }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(filePath.sass.out))
    .pipe(browserSync.stream());
});

gulp.task("sassBuild", () => {
  return gulp
    .src(filePath.sass.in)
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 versions"] }))
    .pipe(gulp.dest(filePath.sass.out));
});

// JS ------------------------------------------------------------------ +
gulp.task("libsDev", () => {
  return gulp
    .src(filePath.jsLibs.in)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rigger())
    .pipe(concat("libs.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(filePath.jsLibs.out))
    .pipe(browserSync.stream());
});

gulp.task("libsBuild", () => {
  return gulp
    .src(filePath.jsLibs.in)
    .pipe(rigger())
    .pipe(concat("libs.js"))
    .pipe(uglify())
    .pipe(gulp.dest(filePath.jsLibs.out));
});

gulp.task("scriptsDev", () => {
  return gulp
    .src(filePath.jsScripts.in)
    .pipe(plumber())
    .pipe(gulp.dest(filePath.jsScripts.out))
    .pipe(browserSync.stream());
});

gulp.task("scriptsBuild", () => {
  return gulp
    .src(filePath.jsScripts.in)
    .pipe(uglify())
    .pipe(gulp.dest(filePath.jsScripts.out));
});

// IMG ------------------------------------------------------------------ +
gulp.task("imgMover", () => {
  return gulp
    .src(filePath.img.in)
    .pipe(newer(filePath.img.out))
    .pipe(gulp.dest(filePath.img.out));
});

gulp.task("tinyPngMover", () => {
  return gulp
    .src([
      "!" + filePath.img.compImgCache + "*.tinypng-sigs",
      filePath.img.compImgCache + "**/*",
    ])
    .pipe(gulp.dest(filePath.img.out));
});

gulp.task("tinyPngHandler", () => {
  return gulp
    .src(filePath.img.in)
    .pipe(plumber())
    .pipe(newer(filePath.img.compImgCache))
    .pipe(tinypng({ key: filePath.img.tinyPngApiKey, log: true }))
    .pipe(gulp.dest(filePath.img.compImgCache));
});

gulp.task("imgOflineHandler", () => {
  return gulp
    .src(filePath.img.in)
    .pipe(newer(filePath.img.out))
    .pipe(
      imagemin(
        [
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ progressive: true }),
          imageminJpegRecompress({
            loops: 5,
            min: 70,
            max: 75,
            quality: "high",
          }),
          imagemin.svgo(),
          imagemin.optipng({ optimizationLevel: 3 }),
          pngquant([0.8, 0.8]),
        ],
        {
          verbose: true,
        }
      )
    )
    .pipe(gulp.dest(filePath.img.out));
});

// SVG ------------------------------------------------------------------ +
gulp.task("svg", () => {
  return gulp
    .src(filePath.svg.in)
    .pipe(svgmin({ js2svg: { pretty: true } }))
    .pipe(
      cheerio({
        run: function ($) {
          $("[fill]").removeAttr("fill");
          $("[stroke]").removeAttr("stroke");
          $("[style]").removeAttr("style");
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(replace("&gt;", ">"))
    .pipe(svgSprite({ mode: { symbol: { sprite: "sprite.svg" } } }))
    .pipe(gulp.dest(filePath.svg.out));
});

// FONTS ------------------------------------------------------------------ +
gulp.task("fonts", () => {
  return gulp
    .src(filePath.fonts.in)
    .pipe(newer(filePath.fonts.out))
    .pipe(gulp.dest(filePath.fonts.out))
    .pipe(browserSync.stream());
});

// CLEANER ------------------------------------------------------------------ +
gulp.task("clearBuild", () => {
  return del(filePath.cleaner);
});

// WATCHER ------------------------------------------------------------------ +
gulp.task("watch", () => {
  browserSync.init(BrowserSyncConfig);
  gulp.watch("./src/**/*.pug", gulp.series("pug")); //PUG +
  gulp.watch("./src/**/*.kit", gulp.series("kit")); //KIT +
  gulp.watch("./src/**/*.scss", gulp.parallel("sassDev")); //SASS +
  gulp.watch("./src/js/libs/*.js", gulp.parallel("libsDev")); //JS LIBS +
  gulp.watch("./src/js/*.js", gulp.parallel("scriptsDev")); //JS SCRIPTS +
  // gulp.watch('./src/img/**/*.{png,jpg,gif,svg}', gulp.series('tinyPngHandler', 'imgComprMover')); //TinyPNG Online+
  gulp.watch(
    "./src/img/**/*.{png,jpg,gif,svg}",
    gulp.parallel(
      "imgOflineHandler" // optimize & compsess
      // 'imgMover', // only transfer
    )
  ); //IMG Ofline +
  gulp.watch("./src/img/svg/*.svg", gulp.parallel("svg")); //SVG +
  gulp.watch("./src/fonts/**/*.", gulp.parallel("fonts")); //FONTS +
});

// TASKER ------------------------------------------------------------------ +
gulp.task(
  "dev",
  gulp.series(
    "clearBuild",
    // 'tinyPngHandler',
    // 'tinyPngMover',
    gulp.parallel(
      "pug",
      "kit",
      "sassDev",
      "libsDev",
      "scriptsDev",
      // 'imgMover',
      "imgOflineHandler",
      "svg",
      "fonts"
    )
  )
);

gulp.task(
  "build",
  gulp.series(
    "clearBuild",
    "pug",
    "kit",
    "sassBuild",
    "libsBuild",
    "scriptsBuild",
    "imgOflineHandler",
    // 'imgMover',
    // 'tinyPngHandler',
    // 'tinyPngMover',
    "svg",
    "fonts"
  )
);

gulp.task("default", gulp.series("dev", gulp.parallel("watch")));
