module.exports = function (grunt) {
    grunt.initConfig({
        uncss: {
            dist: {
                files: [
                    { src: 'views/index.html', dest: 'css/freelancer.css' }
                ]
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-uncss');

    // Default tasks.
    grunt.registerTask('default', ['uncss']);
};