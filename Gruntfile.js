module.exports = function (grunt) {
    'use strict';

    var sources = [ 'tsmonad.ts', 'maybe.ts', 'either.ts', 'monad.ts', 'writer.ts' ],
        tests   = [ 'test/*.ts' ];

    grunt.loadNpmTasks('grunt-typescript');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.loadNpmTasks('grunt-banner');

    grunt.initConfig({
        typescript: {
            options: {
                sourceMap: true,
                noImplicitAny: true,
                declaration: true,
                comments: true
            },
            main: {
                src: sources,
                dest: 'dist/tsmonad.js'
            },
            test: {
                src: tests,
                dest: 'test/bin/tsmonad-test.js'
            }
        },
        watch: {
            tasks: [ 'typescript', 'copy' ],
            files: sources.concat(tests)
        },
        copy: {
            test: {
                expand: true,
                src: [
                  'test/index.html',
                  'test/bin/*.js',
                  'node_modules/underscore/underscore-min.js',
                  'node_modules/qunitjs/qunit/qunit.css',
                  'node_modules/qunitjs/qunit/qunit.js',
                  'node_modules/blanket/dist/qunit/blanket.min.js',
                  'dist/tsmonad.js'
                ],
                dest: 'test/dist/',
                flatten: true
            }
        },
        banner: '// Type definitions for TsMonad\n' +
                '// Project: https://github.com/cbowdon/TsMonad\n' +
                '// Definitions by: Chris Bowdon <https://github.com/cbowdon>\n' +
                '// Definitions by: Valentin Trinque <https://github.com/ValentinTrinque>\n' +
                '// Definitions: https://github.com/borisyankov/DefinitelyTyped\n',
        usebanner: {
            dts: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>',
                    linebreak: true
                },
                files: {
                    src: [ 'dist/tsmonad.d.ts' ]
                }
            }
        }
    });

    grunt.registerTask('default', 'Compiles TypeScript and prepares dist', [ 'typescript', 'copy', 'usebanner' ]);
};
