var gulp = require('gulp');
var changed = require('gulp-changed');
var handlebars = require('gulp-compile-handlebars');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var nodemon = require('gulp-nodemon');
var path = require('path');
var rename = require('gulp-rename');
var runSeq = require('run-sequence');
var sass = require('gulp-sass');
var server = require('gulp-express');
var sgc = require('gulp-sass-generate-contents');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var zip = require('gulp-zip');

/* ============================================================ *\
    WEBSITE CONFIGS
\* ============================================================ */

var config = {
	src: './_src',
	dest: './_build',
	styles: '/styles',
	scripts: '/javascript'
};

var src = {
	scripts: config.src + config.scripts,
	styles: config.src + config.styles
};

var dest = {
	scripts: config.dest + config.scripts,
	styles: config.dest + config.styles
};

/* ============================================================ *\
    ENERATE SASS IMPORTS
\* ============================================================ */

gulp.task('sass-generate-contents', function () {
	gulp.src([
		src.styles + '/_settings/*.scss',
		src.styles + '/_settings/*.scss',
		src.styles + '/_tools/*.scss',
		src.styles + '/_tools/*.scss',
		src.styles + '/_tools/*.scss',
		src.styles + '/_scope/*.scss',
		src.styles + '/_generic/*.scss',
		src.styles + '/_elements/*.scss',
		src.styles + '/_objects/*.scss',
		src.styles + '/_components/*.scss',
		src.views + '/**/*.scss',
		src.styles + '/_trumps/*.scss'
	])
	.pipe(sgc(src.styles + '/main.scss'))
	.pipe(gulp.dest(src.styles));
});

/* ============================================================ *\
    STYLES / SCSS
\* ============================================================ */

gulp.task('sass:main', function(){
	gulp.src(src.styles + '/main.scss')
		.pipe(sass())
		.pipe(minifyCSS())
		.pipe(gulp.dest(dest.styles));
});

/* ============================================================ *\
    SCRIPTS and TESTS
\* ============================================================ */

gulp.task('scripts', function(){
	gulp.src(src.scripts + '/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(dest.scripts));
});

/* ============================================================ *\
    MAIN TASKS
\* ============================================================ */

gulp.task('watch', ['server'], function() {
	gulp.watch(src.views + '/**/*.hbs', ['compile-html']);
	gulp.watch(src.scripts + '/*.js', ['scripts']);
	gulp.watch(src.styles + '/**/*.scss', ['sass']);
	gulp.watch(src.views + '/**/*.scss', ['sass']);
});

runSeq(['sass:dev'], ['sass:legacy']);

gulp.task('default', runSeq(['dev'], ['watch']));
gulp.task('dev', runSeq(['sass-generate-contents'], ['sass', 'compile-html', 'scripts', 'jasmine']));






