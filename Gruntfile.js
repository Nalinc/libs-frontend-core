var src = "src/";
var dist = "dist/";
var test = "test/";
var serverport = process.env.PORT || 8080;

module.exports = function (grunt) {
    
    grunt.initConfig({        
        less:{
            main :{               
                files:[
                        {
                            dest: dist + 'css/libs-frontend-core.css', 
                            src : src + '/styles/less/libs-frontend-core.less'
                        }
                    ]
                }
        },
        cssmin: {
          main: {
            files: [
                    {
                        dest: dist + 'css/libs-frontend-core-min.css', 
                        src: dist + 'css/libs-frontend-core.css'                             
                    }
            ]
          }
        },
        clean: {            
            dist: {
                options: {
                    force: true
                },
                src: [
                    dist
                ]
            }           
        },
        copy: {           
            img: {
                expand: true,
                cwd: src + "styles/img",
                src: [
                    '**/*'
                ],
                dest: dist + "img"
            },
            fonts: {
		expand: true,
		cwd: src + "styles/fonts",
		src: [
		    '**/*'
		],
		dest: dist + "fonts"
            },
            js: {
                expand: true,
                cwd: src + "js",
                src: [
                    '**/*'
                ],
                dest: dist + "js"
            }
        },
        concat: {          
            styles: {
              src: [dist + 'css/libs-frontend-core.css', src + "/styles/css/*.css"],
              dest: dist + 'css/libs-frontend-core.css'
            },
        },
        uglify: {
            main: {
                expand: true,
                cwd: dist + "js",
                src: [
                    '**/*.js'
                ],
                dest: dist + "js",
                ext: '.min.js'
            }
        },
        express: { 
	    options: {
		port: serverport,
	    },  
	    test: {
	      options: {
		script: test + 'server/app.js',
		node_env: 'test'
	      }
	    }
        }        
    });

    //Load grunt Tasks
    grunt.loadNpmTasks('grunt-contrib-less'); 
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-express-server');
    
    grunt.registerTask('express-keepalive', 'Keep grunt running', function(target) {
            var message = 'Test pages are running on http://localhost:' + serverport + '/test/index.html';           
            console.log(message);
            this.async();       
    });
    
    grunt.registerTask('build', [ 
        'clean:dist',
        'copy',
        'less',
        'concat:styles',
        'cssmin',
        'uglify'
    ]);  
    
    grunt.registerTask('default', [ 
            'build'
    ]);  
    
    grunt.registerTask('test', [ 
            'build',
            'express:test',
            'express-keepalive'
           
    ]);   

};