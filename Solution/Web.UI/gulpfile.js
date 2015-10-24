/*jslint node: true */
'use strict';

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    sgc = require('gulp-sass-generate-contents'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer-core'),
    sourcemaps   = require('gulp-sourcemaps'),
    runSeq = require('run-sequence'),
	config = require('./_config/project.json'),
	jshintConfig = require('./_config/jshint.json'),
	jshint = require('gulp-jshint'),
	creds = require('./_config/creds.json'),
	handlebars = require('gulp-compile-handlebars'),
	pixrem = require('gulp-pixrem'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	uncss = require('gulp-uncss'),
	rename = require('gulp-rename'),
	zip = require('gulp-zip');


/* ============================================================ *\
    GENERATE SASS IMPORTS AND
\* ============================================================ */

gulp.task('sass-generate-contents', function () {
	gulp.src([
	'!' + config.src + '/' + config.dirs.styles + '/_settings/_settings.old-ie-7.scss',
	'!' + config.src + '/' + config.dirs.styles + '/_settings/_settings.old-ie-8.scss',
	config.src + '/' + config.dirs.styles + '/_settings/_settings.colors.scss',
	config.src + '/' + config.dirs.styles + '/_settings/*.scss',
	config.src + '/' + config.dirs.styles + '/_tools/_tools.mixins.scss',
	config.src + '/' + config.dirs.styles + '/_tools/_tools.functions.scss',
	config.src + '/' + config.dirs.styles + '/_tools/*.scss',
	config.src + '/' + config.dirs.styles + '/_scope/*.scss',
	config.src + '/' + config.dirs.styles + '/_generic/*.scss',
	config.src + '/' + config.dirs.styles + '/_elements/*.scss',
	config.src + '/' + config.dirs.styles + '/_objects/*.scss',
	config.src + '/' + config.dirs.styles + '/_components/*.scss',
	config.dirs.components + '/**/*.scss',
	config.src + '/' + config.dirs.styles + '/_trumps/*.scss'])
	.pipe(sgc(config.src + '/' + config.dirs.styles + '/main.scss', creds))
	.pipe(gulp.dest(config.src + '/' + config.dirs.styles));
});

gulp.task('sass-generate-contents:legacy:ie7', function () {
	gulp.src([
	config.src + '/' + config.dirs.styles + '/_settings/_settings.breakpoints.scss',
	config.src + '/' + config.dirs.styles + '/_settings/_settings.old-ie-7.scss',
	config.src + '/' + config.dirs.styles + '/main.scss'])
	.pipe(sgc(config.src + '/' + config.dirs.styles + '/ie7.scss', creds, {forceComments:false}))
	.pipe(gulp.dest(config.src + '/' + config.dirs.styles));
});

gulp.task('sass-generate-contents:legacy:ie8', function () {
	gulp.src([
	config.src + '/' + config.dirs.styles + '/_settings/_settings.breakpoints.scss',
	config.src + '/' + config.dirs.styles + '/_settings/_settings.old-ie-8.scss',
	config.src + '/' + config.dirs.styles + '/main.scss'])
	.pipe(sgc(config.src + '/' + config.dirs.styles + '/ie8.scss', creds, {forceComments:false}))
	.pipe(gulp.dest(config.src + '/' + config.dirs.styles));
});

// header and footer only
gulp.task('sass-generate-contents:header-footer', function () {
	gulp.src([
	'!' + config.src + '/' + config.dirs.styles + '/_settings/_settings.old-ie-7.scss',
	'!' + config.src + '/' + config.dirs.styles + '/_settings/_settings.old-ie-8.scss',
	config.src + '/' + config.dirs.styles + '/_settings/_settings.colors.scss',
	config.src + '/' + config.dirs.styles + '/_settings/*.scss',
	config.src + '/' + config.dirs.styles + '/_tools/_tools.mixins.scss',
	config.src + '/' + config.dirs.styles + '/_tools/_tools.functions.scss',
	config.src + '/' + config.dirs.styles + '/_tools/*.scss',
	config.src + '/' + config.dirs.styles + '/_scope/*.scss',
	config.src + '/' + config.dirs.styles + '/_generic/*.scss',
	config.src + '/' + config.dirs.styles + '/_elements/*.scss',
	config.src + '/' + config.dirs.styles + '/_objects/*.scss',
	config.src + '/' + config.dirs.styles + '/_components/_components.social.scss',
	config.dirs.components + '/_partials/site-header/*.scss',
	config.dirs.components + '/_partials/site-cookie-message/*.scss',
	config.dirs.components + '/_partials/navigation-primary/*.scss',
	config.dirs.components + '/_partials/site-footer/*.scss',
	config.dirs.components + '/_partials/site-footer__social/*.scss',
	config.src + '/' + config.dirs.styles + '/_trumps/*.scss'])
	.pipe(sgc(config.src + '/' + config.dirs.styles + '/header-footer.scss', creds))
	.pipe(gulp.dest(config.src + '/' + config.dirs.styles));
});

gulp.task('sass-generate-contents:legacy:header-footer:ie7', function () {
	gulp.src([
	config.src + '/' + config.dirs.styles + '/_settings/_settings.breakpoints.scss',
	config.src + '/' + config.dirs.styles + '/_settings/_settings.old-ie-7.scss',
	config.src + '/' + config.dirs.styles + '/header-footer.scss'])
	.pipe(sgc(config.src + '/' + config.dirs.styles + '/header-footer-legacy-ie7.scss', creds, {forceComments:false}))
	.pipe(gulp.dest(config.src + '/' + config.dirs.styles));
});
gulp.task('sass-generate-contents:legacy:header-footer:ie8', function () {
	gulp.src([
	config.src + '/' + config.dirs.styles + '/_settings/_settings.breakpoints.scss',
	config.src + '/' + config.dirs.styles + '/_settings/_settings.old-ie-8.scss',
	config.src + '/' + config.dirs.styles + '/header-footer.scss'])
	.pipe(sgc(config.src + '/' + config.dirs.styles + '/header-footer-legacy-ie8.scss', creds, {forceComments:false}))
	.pipe(gulp.dest(config.src + '/' + config.dirs.styles));
});


/* ============================================================ *\
    STYLES / SCSS
\* ============================================================ */

gulp.task('sass:dev', function () {
	return gulp.src(config.src + '/' + config.dirs.styles + '/main.scss')
			.pipe(sourcemaps.init())
			.pipe(plugins.sass({ errLogToConsole: true, includePaths: [config.dirs.components], outputStyle: 'compact' }))
			.pipe(postcss([autoprefixer({ browsers: ['> 5%', 'Android 3'] })]))
			.pipe(pixrem(config.pixelBase))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(config.dest + '/' + config.dirs.styles));
});

gulp.task('sass:legacy:ie7', function () {
	return gulp.src(config.src + '/' + config.dirs.styles + '/ie7.scss')
			.pipe(plugins.sass({ errLogToConsole: true, includePaths: [config.dirs.components], outputStyle: 'compact' }))
			.pipe(postcss([autoprefixer({ browsers: ['IE 7'] })]))
			.pipe(pixrem(config.pixelBase))
			.pipe(gulp.dest(config.dest + '/' + config.dirs.styles));
});

gulp.task('sass:legacy:ie8', function () {
	return gulp.src(config.src + '/' + config.dirs.styles + '/ie8.scss')
			.pipe(plugins.sass({ errLogToConsole: true, includePaths: [config.dirs.components], outputStyle: 'compact' }))
			.pipe(postcss([autoprefixer({ browsers: ['IE 8'] })]))
			.pipe(pixrem(config.pixelBase))
			.pipe(gulp.dest(config.dest + '/' + config.dirs.styles));
});

gulp.task('sass:build', function () {
	return gulp.src(config.src + '/' + config.dirs.styles + '/main.scss')
			.pipe(plugins.sass({ errLogToConsole: true, includePaths: [config.dirs.components], outputStyle: 'compact' }))
			.pipe(postcss([autoprefixer({ browsers: ['> 5%', 'Android 3'] })]))
			.pipe(pixrem(config.pixelBase))
			.pipe(gulp.dest(config.build + '/' + config.dirs.styles));
});

gulp.task('sass:build-header-footer', function () {
	return gulp.src(config.src + '/' + config.dirs.styles + '/header-footer.scss')
			.pipe(plugins.sass({ errLogToConsole: true, includePaths: [config.dirs.components], outputStyle: 'compact' }))
			.pipe(postcss([autoprefixer({ browsers: ['> 5%', 'Android 3'] })]))
			.pipe(pixrem(config.pixelBase))
			.pipe(minifyCss())
			.pipe(rename('main.css'))
			.pipe(gulp.dest(config.headerFooter + '/' + config.dirs.styles));
});
gulp.task('sass:build-header-footer:legacy:ie7', function () {
	return gulp.src(config.src + '/' + config.dirs.styles + '/header-footer-legacy-ie7.scss')
			.pipe(plugins.sass({ errLogToConsole: true, includePaths: [config.dirs.components], outputStyle: 'compact' }))
			.pipe(postcss([autoprefixer({ browsers: ['IE 7'] })]))
			.pipe(pixrem(config.pixelBase))
			.pipe(minifyCss())
			.pipe(rename('ie7.css'))
			.pipe(gulp.dest(config.headerFooter + '/' + config.dirs.styles));
});
gulp.task('sass:build-header-footer:legacy:ie8', function () {
	return gulp.src(config.src + '/' + config.dirs.styles + '/header-footer-legacy-ie8.scss')
			.pipe(plugins.sass({ errLogToConsole: true, includePaths: [config.dirs.components], outputStyle: 'compact' }))
			.pipe(postcss([autoprefixer({ browsers: ['IE 8'] })]))
			.pipe(pixrem(config.pixelBase))
			.pipe(minifyCss())
			.pipe(rename('ie8.css'))
			.pipe(gulp.dest(config.headerFooter + '/' + config.dirs.styles));
});

// minify

// TODO add strip comments task for the non minified files.

gulp.task('css:minify', function() {
  return gulp.src(['!' + config.dest + '/' + config.dirs.styles + '/ie7.css', '!' + config.dest + '/' + config.dirs.styles + '/ie8.css', config.dest + '/' + config.dirs.styles + '**/*.css'])
    .pipe(minifyCss())
    .pipe(gulp.dest(config.build));
});

// strip unused css

gulp.task('css:clean', function() {
    return gulp.src(config.build + '/' + config.dirs.styles +'/main.css')
        .pipe(uncss({
            html: ['build/*.html']
        }))
        .pipe(gulp.dest(config.build + '/' + config.dirs.styles));
});

gulp.task('css:minify:header-footer', function() {
  return gulp.src(config.headerFooter + '/' + config.dirs.styles + '**/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest(config.build));
});


/* ============================================================ *\
    IMAGES / minify images
\* ============================================================ */

gulp.task('imagemin', function () {
    return gulp.src(config.src + '/' + config.dirs.images + '/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.dest + '/' + config.dirs.images));
});

/* ============================================================ *\
    SCRIPTS JS / lint, concat and minify scripts
\* ============================================================ */

gulp.task('scripts:lint', function () {
	gulp.src([config.src + '/' + config.dirs.scripts + '/**/*.js'])
			.pipe(jshint(jshintConfig));
});

gulp.task('scripts:concat', function(){
	return gulp.src([config.src + '/' + config.dirs.scripts + '/src/breakpoints.js', config.src + '/' + config.dirs.scripts + '/src/*.js'])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest(config.dest + '/' + config.dirs.scripts));
});

gulp.task('scripts:concat:critical', function(){
	return gulp.src([config.src + '/' + config.dirs.scripts + '/vendor/*.js'])
    .pipe(concat('critical-bundle.js'))
    .pipe(gulp.dest(config.dest + '/' + config.dirs.scripts));
});

gulp.task('scripts:concat:ie', function(){
	return gulp.src([config.src + '/' + config.dirs.scripts + '/ie/*.js'])
    .pipe(concat('ie.js'))
    .pipe(gulp.dest(config.dest + '/' + config.dirs.scripts));
});

gulp.task('scripts:concat:header-footer', function(){
	return gulp.src([config.src + '/' + config.dirs.scripts + '/vendor/jquery-1.11.3.min.js', config.src + '/' + config.dirs.scripts + '/src/breakpoint.js', config.src + '/' + config.dirs.scripts + '/src/website.js', , config.src + '/' + config.dirs.scripts + '/src/navigation-primary.js'])
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.headerFooter + '/' + config.dirs.scripts));
});

// minify 

gulp.task('scripts:minify', function() {
  return gulp.src(config.dest + '/' + config.dirs.scripts +'/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(config.build + '/' + config.dirs.scripts));
});




/* ============================================================ *\
    MOVE / Copy files that don't need compressing
\* ============================================================ */
gulp.task('copy:fonts', function(){
	return gulp.src([config.src + '/' + config.dirs.fonts + '/**/*'])
	.pipe(gulp.dest(config.dest + '/' + config.dirs.fonts));
})

gulp.task('copy', function(){
	return gulp.src(['!' + config.dest + '/styles', '!' + config.dest + '/styles/*.map', config.dest + '/**/*'])
	.pipe(gulp.dest(config.build));
})

gulp.task('copy:header-footer-fonts', function(){
	return gulp.src([ 
		config.src + '/' + config.dirs.fonts + '**/*'])
	.pipe(gulp.dest(config.headerFooter));
})

gulp.task('copy:header-footer-images', function(){
	return gulp.src([ 
		'!' + config.src + '/' + config.dirs.images + '/global/chevron.*',
		'!' + config.src + '/' + config.dirs.images + '/global/george-title.*',
		'!' + config.src + '/' + config.dirs.images + '/global/new.*',
		config.src + '/' + config.dirs.images + '/global/*'])
	.pipe(gulp.dest(config.headerFooter + '/' + config.dirs.images + '/global'));
})


/* ============================================================ *\
    COMPILE TEMPLATES / HTML
\* ============================================================ */

gulp.task('compile-html', function () {
    var templateData = {}, // if template data is used then get it from a json file
    options = {
        batch : ['./views/_partials'],
        helpers: {
        	assetUrl: 'http://www.asda.com'
        }
    }
 	
    return gulp.src(['./views/*.hbs', '!./views/header-footer.hbs'])
        .pipe(handlebars(templateData, options))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest('build'));
});

gulp.task('compile-html:header-footer', function () {
    var templateData = {}, // if template data is used then get it from a json file
    options = {
        batch : ['./views/_partials'],
        helpers: {
        	assetUrl: 'http://www.asda.com'
        }
    }
 	
    return gulp.src(['./views/header-footer.hbs'])
        .pipe(handlebars(templateData, options))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest('header-footer'));
});


/* ============================================================ *\
    PACKAGE THE FOLDER UP
\* ============================================================ */

gulp.task('package-release', function () {

	var d = new Date();
	var packageName = 'asda.com-build_' + d.getDay() + '.' + d.getMonth() + '.' + d.getFullYear() + '_' + d.getHours() + '.' + d.getMinutes();

    return gulp.src('build/**/*')
        .pipe(zip(packageName + '.zip'))
        .pipe(gulp.dest('release'));
});

/* ============================================================ *\
    MAIN TASKS
\* ============================================================ */


gulp.task('watch', function () {
	gulp.watch([config.src + '/' + config.dirs.styles + '/**/*.scss', config.dirs.components + '/**/*.scss', config.src + '/' + config.dirs.scripts + '/**/*.js'], ['sass:dev', 'scripts:concat']);
});

gulp.task('watchers', function(cb){
	runSeq(['sass:dev'], ['sass:legacy']);
})

gulp.task('default', function (cb) {
	runSeq(['sass-generate-contents'], ['sass-generate-contents:legacy:ie7', 'sass-generate-contents:legacy:ie8'],['sass:dev'], ['sass:legacy:ie7', 'sass:legacy:ie8', 'imagemin', 'copy:fonts', 'scripts:lint','scripts:concat:critical', 'scripts:concat', 'scripts:concat:ie'], ['sass:dev'], ['sass:legacy:ie7', 'sass:legacy:ie8'], cb);
});

gulp.task('dev', function(cb){
	runSeq(['default'], ['watch']);
})

gulp.task('build-header-footer', function(cb){
	runSeq(['sass-generate-contents:header-footer'], 
		['sass-generate-contents:legacy:header-footer:ie7', 'sass-generate-contents:legacy:header-footer:ie8'], 
		['copy:header-footer-images', 'copy:header-footer-fonts', 'scripts:concat:header-footer'],
		['sass:build-header-footer'], 
		['sass:build-header-footer:legacy-ie7', 'sass:build-header-footer:legacy-ie8'], 
		['compile-html:header-footer'], cb);
});

gulp.task('build', function (cb) {
	runSeq(['default'], ['copy'], ['scripts:minify'], ['compile-html'], ['css:minify'],  cb);
});

gulp.task('release', function (cb) {
	runSeq(['build'], ['package-release'],  cb);
});




