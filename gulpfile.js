var gulp = require('gulp'),
    browsersync = require('browser-sync'),
    pug = require('gulp-pug'),
    stylus = require('gulp-stylus'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    postCSS = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    del = require('del')

// Работа со Stylus
gulp.task('stylus', function() {
    return gulp.src([
            'dev/src/stylus/main.styl',
        ])
        .pipe(plumber())
        .pipe(stylus({
            'include css': true
        }))
        .pipe(postCSS( [autoprefixer(['last 2 version'])]) )
        .on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(gulp.dest('dev/css'))
        .pipe(browsersync.reload({
            stream: true
        }));
});

// Работа с Pug
gulp.task('pug', function() {
    return gulp.src('dev/src/pug/pages/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(gulp.dest('dev'))
        .pipe(browsersync.reload({
            stream: true
        }));
});

// Работа с JS
gulp.task('scripts', function() {
    return gulp.src([
            'dev/src/js/main.js'
        ])
        .pipe(gulp.dest('dev/js'))
        .pipe(browsersync.reload({
            stream: true
        }));
});

// Browsersync
gulp.task('browsersync', function() {
    browsersync({
        server: {
            baseDir: 'dev'
        },
    });
});

// Очистка папки сборки
gulp.task('clean', function() {
    return del.sync('prodact');
});

gulp.task('build', ['clean', 'stylus'], function() {
    var buildCss = gulp.src('dev/static/css/*.css')
        .pipe(gulp.dest('product/css'));

    var buildFonts = gulp.src('dev/static/fonts/**/*')
        .pipe(gulp.dest('product/fonts'));

    var buildHtml = gulp.src('dev/*.html')
        .pipe(gulp.dest('product/'));
});

// Слежение
gulp.task('watch', ['browsersync', 'stylus', 'pug', 'scripts'], function() {
    gulp.watch('dev/src/stylus/**/*.styl', ['stylus']);
    gulp.watch('dev/src/pug/**/*.pug', ['pug']);
    gulp.watch('dev/src/js/**/*.js', ['scripts']);
    gulp.watch('dev/*.html', browsersync.reload);
});

// Дефолтный таск
gulp.task('default', ['watch']);