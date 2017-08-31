module.exports = function (grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      with_banner: {
        options: {
          banner: '/*\n' +
            'Minified CSS of <%= pkg.name %>\n' +
            '*/\n',
        },
        files: {
          'all.min.css': [
            'css/components/*.css',
            'css/app.css',
          ],
        },
      },
    },
    uglify: {
      options: {
        banner: '/* Minified JavaScript of <%= pkg.name %> */\n',
      },
      my_target: {
        files: {
          'public/bundle_ugly.js': [
            'public/bundle.js',
          ],
        },
      },
    },

    browserify: {
      dist: {
        options: {
          banner: '/* Browserify JavaScript of <%= pkg.name %> */\n',
          debug: true,
          transform: [['babelify', {presets: ['es2015', 'react']}]],
        },        
        src: ['js/source/*.js', 'js/source/components/*.js'],
        dest: '../../NodeJS/easyDonor/public/app_babel.js',
      },
    },

    watch: {
      options: {
        livereload: true,
        spawn: false,
      },
      css: {
        files: ['css/*.css', 'css/components/*.css'],
        tasks: ['cssmin'],
      },
      js: {
        files: [ 'js/source/*.js', 'js/source/components/*.js'],
        tasks: ['browserify'],
      },
    },
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-babel'); 
  grunt.registerTask('default', ['browserify']);
};
