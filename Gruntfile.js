module.exports = function (grunt) {

	const sass = require('node-sass');

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			dist: {
				expand: true,
				cwd: 'views/development/',
				src: '**/*',
				dest: 'views/production/',
			}
		},
		useminPrepare: {
			html: 'views/production/index.ejs',
			options: {
				root: 'public/',
				dest: 'public/dist'
			}
		},
		usemin: {
			html: 'views/production/index.ejs',
			options: {
				blockReplacements: {
					css: function (block) {
						return '<link rel="stylesheet" href="/dist/' + block.dest + '">';
					},
					js: function (block) {
						return '<script src="/dist/' + block.dest + '"></script>';
					}
				}
			}
		},
		sass: {
			options: {
				implementation: sass,
				sourceMap: false
			},
			dist: {
				files: {
					'public/stylesheets/bootstrap.css': 'public/libs/bootstrap/scss/bootstrap.scss',
					'public/stylesheets/fontawesome.css': 'public/libs/components-font-awesome/scss/fontawesome.scss',
					'public/stylesheets/style.css': 'public/scss/style.scss',
				}
			}
		},
		clean: {
			pre_build: ['views/production/', 'public/dist/'],
			post_build: ['.tmp']
		}
	});

	grunt.registerTask('default', [
		'clean:pre_build',
		'copy',
		'sass',
		'useminPrepare',
		'concat:generated',
		'cssmin:generated',
		'uglify:generated',
		'usemin',
		'clean:post_build'
	]);
};