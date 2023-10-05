module.exports = function (grunt) {
  grunt.initConfig({
    source: 'source/',
    dest: 'dest/',
    temp: 'temp/',
    prod: 'markup/',

    pug: {
      dev: {
        options: {
          pretty: true,
        },
        files: [
          {
            expand: true,
            cwd: './<%= source%>',
            src: ['**/*.pug', '!layouts/**/*.pug', '!modules/**/*.pug'],
            dest: '<%= dest%>',
            ext: '.html',
            extDot: 'first',
          },
        ],
      },

      prod: {
        options: {
          pretty: true,
        },
        files: [
          {
            expand: true,
            cwd: './<%= source%>',
            src: ['**/*.pug', '!layouts/**/*.pug', '!modules/**/*.pug'],
            dest: '<%= temp%>',
            ext: '.html',
            extDot: 'first',
          },
        ],
      },
    },

    stylus: {
      options: {
        compress: false,
        urlfunc: {
          name: 'embedurl',
          limit: 30000,
        },
      },
      template: {
        files: [
          {
            expand: true,
            cwd: '<%= source%>styl/placeholders/',
            src: ['*.styl'],
            dest: '<%= dest%>template/placeholders/',
            extDot: 'first',
            ext: '.css',
          },
          {
            '<%= dest%>template/template_styles.css': [
              '<%= source%>styl/template_styles.styl',
              '<%= source%>modules/**/*.styl',
            ],
          },
        ],
      },
      issue: {
        files: [
          {
            '<%= dest%>template/placeholders/search.css':
              '<%= source%>styl/placeholders/search.styl',
          },
          {
            expand: true,
            cwd: '<%= source %>components/search/',
            src: ['**/*.styl'],
            dest: '<%= dest %>components/search/',
            extDot: 'first',
            ext: '.css',
          },
        ],
      },
      components: {
        files: [
          {
            expand: true,
            cwd: '<%= source%>components/',
            src: ['**/*.styl'],
            dest: '<%= dest%>components/',
            extDot: 'first',
            ext: '.css',
          },
        ],
      },
      prod: {
        options: {
          compress: true,
        },
        files: [
          {
            expand: true,
            cwd: '<%= source%>components/',
            src: ['**/*.styl'],
            dest: '<%= temp %>components/',
            extDot: 'first',
            ext: '.css',
          },
          {
            expand: true,
            cwd: '<%= source%>styl/placeholders/',
            src: ['*.styl'],
            dest: '<%= temp %>template/placeholders/',
            extDot: 'first',
            ext: '.css',
          },
          {
            '<%= temp %>template/template_styles.css': [
              '<%= source%>styl/template_styles.styl',
              '<%= source%>modules/**/*.styl',
            ],
          },
        ],
      },
    },

    concat: {
      js: {
        files: {
          '<%= source %>js/script.js': [
            '<%= source %>js/src/top.js',
            '<%= source %>js/main.js',
            '<%= source %>modules/**/*.js',
            '<%= source %>js/src/bottom.js',
          ],
        },
      },
      pluginsJS: {
        files: {
          '<%= dest%>template/script.js': [
            '<%= source %>js/script.js',
            '<%= source %>js/src/plugins/**/*.js',
          ],
        },
      },
      pluginsCSS: {
        files: {
          '<%= dest %>template/template_styles.css': [
            '<%= dest %>template/template_styles.css',
            '<%= source %>js/src/plugins/**/*.css',
          ],
        },
      },
      prod: {
        files: {
          '<%= temp %>template/script.js': [
            '<%= source %>js/src/top.js',
            '<%= source %>js/main.js',
            '<%= source %>modules/**/*.js',
            '<%= source %>js/src/bottom.js',
          ],
        },
      },
      prodPluginsJS: {
        files: {
          '<%= temp %>template/script.js': [
            '<%= temp %>template/script.js',
            '<%= source %>js/src/plugins/**/*.js',
          ],
        },
      },
      prodPluginsCSS: {
        files: {
          '<%= temp %>template/template_styles.css': [
            '<%= temp %>template/template_styles.css',
            '<%= source %>js/src/plugins/**/*.css',
          ],
        },
      },
    },

    jshint: {
      dev: {
        options: {
          curly: true,
          eqeqeq: true,
          eqnull: true,
          browser: true,
          newcap: true,
          globals: {
            jQuery: true,
            console: true,
          },
        },
        files: {
          src: ['<%= source %>js/script.js', '<%= source %>components/**/*.js'],
        },
      },
      prod: {
        options: {
          curly: true,
          eqeqeq: true,
          eqnull: true,
          browser: true,
          newcap: true,
          globals: {
            jQuery: true,
            console: true,
          },
        },
        files: {
          src: [
            '<%= temp %>template/script.js',
            '<%= temp %>components/**/*.js',
          ],
        },
      },
    },

    uglify: {
      devTemplate: {
        options: {
          mangle: false,
          compress: false,
          beautify: true,
          preserveComments: 'some',
        },
        files: [
          {
            '<%= dest%>template/script.js': '<%= source %>js/script.js',
          },
        ],
      },
      devComponents: {
        options: {
          mangle: false,
          compress: false,
          beautify: true,
        },
        files: [
          {
            expand: true,
            cwd: '<%= source %>components/',
            src: '**/*.js',
            dest: '<%= dest%>components/',
            ext: '.js',
            extDot: 'first',
          },
        ],
      },
      prodTemplate: {
        options: {
          mangle: true,
          compress: {},
          preserveComments: 'some',
        },
        files: [
          {
            '<%= temp %>template/script.js': '<%= temp %>template/script.js',
          },
        ],
      },
      prodComponents: {
        options: {
          compress: {},
        },
        files: [
          {
            expand: true,
            cwd: '<%= source %>components/',
            src: '**/*.js',
            dest: '<%= temp %>components/',
            ext: '.js',
            extDot: 'first',
          },
        ],
      },
    },

    clean: {
      js: {
        src: ['<%= source %>js/script.js'],
      },
      images: {
        src: ['<%= dest %>template/images/'],
      },
      temp: {
        src: ['<%= temp %>'],
      },
    },

    copy: {
      images: {
        files: [
          {
            expand: true,
            cwd: '<%= source %>images/',
            src: ['**/*.*'],
            dest: '<%= dest %>template/images/',
          },
        ],
      },
      upload: {
        files: [
          {
            expand: true,
            cwd: '<%= source %>upload/',
            src: ['**/*.*'],
            dest: '<%= dest %>upload/',
          },
        ],
      },
      tempImages: {
        files: [
          {
            expand: true,
            cwd: '<%= source %>images/',
            src: ['**/*.*'],
            dest: '<%= temp %>template/images/',
          },
        ],
      },
      tempUpload: {
        files: [
          {
            expand: true,
            cwd: '<%= source %>upload/',
            src: ['**/*.*'],
            dest: '<%= temp %>upload/',
          },
        ],
      },
      devComponents: {
        files: [
          {
            expand: true,
            cwd: '<%= source %>components/',
            src: ['**/*.js'],
            dest: '<%= dest %>components/',
          },
        ],
      },
      prodComponents: {
        files: [
          {
            expand: true,
            cwd: '<%= source %>components/',
            src: ['**/*.js'],
            dest: '<%= temp %>components/',
          },
        ],
      },
      prod: {
        files: [
          {
            expand: true,
            cwd: '<%= temp %>',
            src: ['**/*.*'],
            dest: '<%= prod %>',
          },
        ],
      },
    },

    watch: {
      livereload: {
        options: {
          livereload: true,
        },
        files: ['**/*'],
      },

      html: {
        files: '**/*.pug',
        tasks: 'pug:dev',
      },

      cssGeneral: {
        files: [
          '<%= source %>**/*.styl',
          //change component name
          '!<%= source %>components/header/**/*.styl',
          '!<%= source %>styl/placeholders/**/*.styl',
        ],
        tasks: 'css',
      },

      css: {
        files: '<%= source %>**/*.styl',
        tasks: 'css',
      },

      js: {
        files: ['<%= source %>**/*.js', '!<%= source %>js/script.js'],
        tasks: ['js'],
      },

      img: {
        files: '<%= source %>images/**/*.*',
        tasks: ['copy:images'],
      },
    },

    connect: {
      server: {
        options: {
          port: 3000,
          base: '<%= dest%>',
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('css', [
    'stylus:template',
    'stylus:components',
    'concat:pluginsCSS',
  ]);
  grunt.registerTask('js', [
    'concat:js',
    'copy:devComponents',
    /*'jshint:dev',*/ 'concat:pluginsJS',
    /*'uglify:devTemplate',*/
    /*'uglify:devComponents',*/ 'clean:js',
  ]);
  grunt.registerTask('html', ['copy:images', 'pug:dev']);
  grunt.registerTask('default', ['connect', 'css', 'js', 'html', 'watch']);

  grunt.registerTask('prod', [
    'stylus:prod',
    'concat:prodPluginsCSS',
    'pug:prod',
    //js
    'concat:prod',
    'copy:prodComponents',
    //'jshint:prod',
    //'uglify:prodTemplate',
    'concat:prodPluginsJS',
    //'uglify:prodComponents',
    //images
    'clean:images',
    'copy:tempImages',
    'copy:tempUpload',
    //copy
    'copy:prod',
    'clean:temp',
  ]);
};
