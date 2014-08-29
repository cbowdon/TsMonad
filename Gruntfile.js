module.exports = function (grunt) {
    'use strict';

    var sources = '*.ts',
        tests   = 'test/*.ts';

    grunt.loadNpmTasks('grunt-typescript');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        typescript: {
            options: {
                sourceMap: true,
                noImplicitAny: true
            },
            main: {
                src: [ sources ],
                dest: 'dist/tsmonad.js'
            },
            test: {
                src: [ tests ],
                dest: 'test/dist/tsmonad.js'
            }
        },
        watch: {
            tasks: 'typescript',
            files: [ sources, tests ]
        }
    });

    grunt.registerTask('default', 'Compiles TypeScript', [ 'typescript', 'watch' ]);
};
