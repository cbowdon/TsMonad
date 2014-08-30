module.exports = function (grunt) {
    'use strict';

    var sources = [ 'maybe.ts', 'either.ts' ],
        tests   = [ 'test/*.ts' ];

    grunt.loadNpmTasks('grunt-typescript');

    grunt.loadNpmTasks('grunt-contrib-watch');

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
                dest: 'test/dist/tsmonad-test.js'
            }
        },
        watch: {
            tasks: 'typescript',
            files: sources.concat(tests)
        }
    });

    grunt.registerTask('default', 'Compiles TypeScript', [ 'typescript' ]);
};
