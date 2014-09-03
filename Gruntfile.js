module.exports = function (grunt) {
    'use strict';

    var sources = [ 'tsmonad.ts', 'maybe.ts', 'either.ts', 'monad.ts', 'writer.ts' ],
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
