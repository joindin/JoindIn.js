module.exports = function (grunt) {
   'use strict';

   require('load-grunt-tasks')(grunt);

   var config = {
      src: 'src',
      dist: 'dist'
   };

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      config: config,

      cssmin: {
         dist: {
            files: {
               '<%= config.dist %>/joindin.min.css': ['<%= config.src %>/joindin.css']
            }
         }
      },
      uglify: {
         options: {
            banner: '/*! joindin.js <%= pkg.version %> | Aurelio De Rosa (@AurelioDeRosa) | MIT/GPL-3.0 Licensed */\n'
         },
         dist: {
            files: {
               '<%= config.dist %>/joindin.min.js': ['<%= config.src %>/joindin.js']
            }
         }
      },
      jshint: {
         files: ['Gruntfile.js', 'src/**/*.js'],
         options: {
            jshintrc: '.jshintrc',
            reporter: require('jshint-stylish')
         }
      },
      jscs: {
         src: 'src/**/*.js',
         options: {
            config: '.jscsrc',
            force: true,
            fix: true
         }
      },
      watch: {
         files: ['<%= jshint.files %>'],
         tasks: ['jshint', 'jscs']
      }
   });

   grunt.registerTask('test', [
      'jshint'
   ]);

   grunt.registerTask('default', [
      'jshint',
      'uglify',
      'cssmin'
   ]);
};