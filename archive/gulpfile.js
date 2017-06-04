var gulp = require('gulp'),
    sass = require('gulp-sass');

var input = './css/sass/*.scss';
var output = './css/';

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded',
  includePaths: [
    "node_modules/leaflet/dist/leaflet.css",
    "node_modules/leaflet.locatecontrol/dist/L.Control.Locate.min.css",
    "node_modules/leaflet-control-geocoder/dist/Control.Geocoder.css",
    "node_modules/leaflet-search/dist/leaflet-search.min.css"
  ]
};

gulp.task('sass', function () {
  return gulp
    // Find all `.scss` files from the `css/sass/` folder
    .src(input)
    // Run Sass on those files
    .pipe(sass(sassOptions))
    // Write the resulting CSS in the output folder
    .pipe(gulp.dest(output));
});

gulp.task('watch', function() {
  return gulp
    // Watch the input folder for change,
    // and run `sass` task when something happens
    .watch(input, ['sass'])
    // When there is a change,
    // log a message in the console
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', ['sass', 'watch']);
