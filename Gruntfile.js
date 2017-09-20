/*jshint esnext:true */
/* globals module */

module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
/*
    uglify: {
      js: {
        options: {
          mangle: true
        },
        files: {
          'site/assets/js/treeera.js' : ['src/scripts/backdrop.js', 'src/scripts/popover.js', 'src/scripts/treeera.js']
        }
      }
    },
*/
    compass : {
      dist : {
        options : {
          sassDir : 'src',
          cssDir : 'docs/build',
          environment : 'production',
          outputStyle : 'compressed'
        }
      }
    },

    watch : {
      css : {
        files : ['src/*.scss'],
        tasks : ['compass']
      }
      /*,
      js : {
        files : ['src/scripts/*.js'],
        tasks : ['uglify']
      }
      */
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.registerTask('default', ['compass', 'uglify']);
};
