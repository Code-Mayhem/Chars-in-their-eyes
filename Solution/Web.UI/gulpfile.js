var gulp = require('gulp');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var runSeq = require('run-sequence');
var sass = require('gulp-sass');
var sgc = require('gulp-sass-generate-contents');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

/* ============================================================ *\
    WEBSITE CONFIGS
\* ============================================================ */

var config = {
	src: './_source',
	dest: './_build',
	styles: '/styles',
	scripts: '/scripts'
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

gulp.task('sass', function(){
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

gulp.task('default', function() {
	runSeq(['dev'], ['watch']);
});

gulp.task('watch', function() {
	gulp.watch(src.scripts + '/*.js', ['scripts']);
	gulp.watch(src.styles + '/**/*.scss', ['sass']);
});

gulp.task('dev', function() {
	runSeq(['sass-generate-contents'], ['sass', 'scripts']);
});





