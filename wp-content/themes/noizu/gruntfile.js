module.exports = function(grunt){
    var defaultTask;

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'), 

        browserify : {
            app : {
                files : {
                    'assets/js/app.js' : 'assets/js/app/main.js'
                }
            }
        },

        uglify : {
            options : {
                beautify : {
                    ascii_only : true,
                    beautify   : false
                }
            },
            app : {
                src  : 'assets/js/app.js',
                dest : 'assets/js/app.min.js'
            }
        },

        jshint : {
            options : {
                globals : {
                    'app'       : true,
                    'jQuery'    : true,
                    'Promise'   : true,
                    'Masonry'   : true,
                    'Hammer'    : true
                },
                curly       : true,
                eqeqeq      : true,
                undef       : true,
                node        : true,
                browser     : true,
                devel       : true,
                validthis   : true,
                '-W097'     : true,
                '-W044'     : true
            },
            app : ['gruntfile.js', 'assets/js/app/**/*.js']
        },

        less : {
            build : {
                src  : 'assets/less/style.less',
                dest : 'style.css'
            }
        },

        watch : {
            options : {
                spawn       : false,
                livereload  : true
            },
            js : {
                files : 'assets/js/app/**/*.js',
                tasks : ['js', 'js-min']
                // tasks : ['js']
            },
            less : {
                files : 'assets/less/*.less',
                tasks : ['less:build']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-browserify');

    defaultTask = ['jshint:app', 'browserify:app'];

    grunt.registerTask('default', defaultTask);
    grunt.registerTask('js', defaultTask);
    grunt.registerTask('js-min', ['uglify:app']);

};