module.exports = function (grunt) {
    "use strict";

    var pkg = grunt.file.readJSON("package.json");

    grunt.initConfig({
        pkg: pkg,
        concat: {
            local : {
                files: {
                    "local/js/<%= pkg.name %>.js": ["src/js/**/*.js"],
                    "local/js/libs.js": [
                        "bower_components/angular/angular.js",
                        "bower_components/angular-route/angular-route.js",
                        "bower_components/angular-translate/angular-translate.js"
                    ],
                    "local/css/libs.css": [
                        "bower_components/normalize.css/normalize.css"
                    ]

                }
            },
            development: {
                files: {
                }
            }
        },

        less: {
            local : {
                files: {
                    "local/css/<%= pkg.name %>.css": "src/**/*.less"
                }
            },
            development: {
                files: {
                    "development/css/<%= pkg.name %>.css": "src/**/*.less"
                }
            }
        },

        copy: {
            local : {
                files : [
                    {cwd: "src/", src: ["*", "!app.js"], dest: "local/", expand: true, filter: "isFile"},
                    {cwd: "src/js/modules/", src: ["**/*.tpl.html"], dest: "local/templates", expand: true, filter: "isFile", rename: function (dst, src) {
                        return dst + "/" + src.replace("/views", "");
                    }},
                    {cwd: "bower_components/lato/font/", src: ["**/*"], dest: "local/fonts", expand: true, filter: "isFile"}
                ]
            },
            development: {
                files : [
                    {cwd: "src/", src: ["*", "!app.js"], dest: "development/", expand: true, filter: "isFile"}
                ]
            }
        },

        autoprefixer : {
            local : {
                options: {
                    diff: false, // or "custom/path/to/file.css.patch"
                    browsers : ["last 1 version"]
                },
                expand: true,
                flatten: true,
                src: "local/css/*.css", // -> src/css/file1.css, src/css/file2.css
                dest: "local/css/" // -> dest/css/file1.css, dest/css/file2.css
            },
            development : {
                options: {
                    diff: false, // or "custom/path/to/file.css.patch"
                    browsers : ["last 1 version"]
                },
                expand: true,
                flatten: true,
                src: "development/css/*.css", // -> src/css/file1.css, src/css/file2.css
                dest: "development/css/" // -> dest/css/file1.css, dest/css/file2.css
            }
        },

        replace : {
            local: {
                options: {
                    patterns: [{
                        json: pkg
                    }]
                },
                files: [{
                    expand: true,
                    flatten: false,
                    src: ["local/js/<%= pkg.name %>.js", 'local/**/*.html', 'local/webManifest.json']
                }]
            },

            development: {
                options: {
                    patterns: [{
                        json: pkg
                    }]
                },
                files: [{
                    expand: true,
                    flatten: false,
                    src: ["development/js/<%= pkg.name %>.js", 'development/*.html']
                }]
            }
        },

        babel : {
            options: {
                sourceMap: false
            },
            dist: {
                files: {
                    'local/js/<%= pkg.name %>_es6.js': 'local/js/<%= pkg.name %>.js'
                }
            }
        },

        watch: {
            scripts: {
                files: ["src/**/*"],
                tasks: ["local"],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-autoprefixer");
    grunt.loadNpmTasks("grunt-replace");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-babel");

    grunt.registerTask("development", ["concat:development", "less:development", "autoprefixer:development", "copy:development", "replace:development"]);
    grunt.registerTask("local", ["concat:local", "less:local", "autoprefixer:local", "copy:local", "replace:local", "babel"]);
    grunt.registerTask("test", ["karma:development"]);

};
