var _ = require('lodash');
var fs = require('fs');

var potatoEntities =
    [
        'controller',
        'factory',
        'directive',
        'value',
        'filter',
        'decorator',
        'service'
    ];

module.exports = function (grunt) {

    grunt.registerMultiTask('turnOffPotatoDeclaration',
        'prepare files for requirejs build', function () {

            this.files.forEach(function (mapping) {

                mapping.src.map(function (path) {
                    var script = grunt.file.read(path);

                    var requireWrite = false;
                    _.forEach(potatoEntities, function (entity) {
                        var regexp = new RegExp('register' + entity.charAt(0).toUpperCase() + entity.slice(1), 'gm')

                        if (script.match(regexp)) {
                            script = script.replace(regexp, entity);
                            requireWrite = true;
                        }
                    });

                    if (requireWrite)
                        grunt.file.write(path, script);
                });

            });
            return true;
        });


    grunt.registerMultiTask('turnOnPotatoDeclaration',
        'prepare files for requirejs build', function () {

            this.files.forEach(function (mapping) {

                mapping.src.map(function (path) {
                    var script = grunt.file.read(path);

                    var requireWrite = false;
                    _.forEach(potatoEntities, function (entity) {
                        var regexp = new RegExp('module.' + entity + '\\s*\\(', 'gm');

                        if (script.match(regexp)) {
                            script = script.replace(regexp, 'module.register' + entity.charAt(0).toUpperCase() + entity.slice(1) + '(');
                            requireWrite = true;
                        }
                    });

                    if (requireWrite)
                        grunt.file.write(path, script);
                });

            });
            return true;
        });

    grunt.registerMultiTask('addIncludes',
        'prepare files for requirejs build', function () {

            var options = this.options();
            this.files.forEach(function (mapping) {

                mapping.src.map(function (path) {
                    var script, scriptMatcher, scriptUpdate;


                    // wrapping file to define
                    if (options.wrapToDefine) {
                        script = grunt.file.read(path);
                        script = "define(['angular'], function(){" + script + "})";
                        grunt.file.write(path, script);
                    }

                    // injecting module to app file
                    if(options.injectToApp){
                        script = grunt.file.read(options.appFile);
                        scriptMatcher = script.match(/module\s*\([\s\S]+?\]/m);
                        if(scriptMatcher){
                            scriptUpdate = scriptMatcher[0].replace(/\]/, ',"' + options.name + '"]');
                            script = script.replace(scriptMatcher[0], scriptUpdate);
                        }
                        grunt.file.write(options.appFile, script);
                    }


                    // writing to includes file
                    script = grunt.file.read(options.includesFile);
                    script = script.replace(/\]/gm, ',"' + options.name + '"]');
                    grunt.file.write(options.includesFile, script);

                });

            });
            return true;
        });
        
    /****************************************************************
    * This task does following things:
    *  1. Adds version number(package.json version) to files specified in src array (css/js etc.).
    *  2. Updates corresponding file references in index html.
    *  3. Update requirejs versioned module names in optimized js files.
    * 
    * This task takes following parameters:
    *  src : Array of files to be versioned (css/js etc.)
    *  index: Index html file path
    *  requireJs.updateRequireModules: If true, update requirejs versioned modules names in optimized js files.
    *  requireJs.datamain: data-main attribute. This should be same as specified in index html.
    *  requireJs.rconfigJs: rconfig.js file path. This should be same as specified in index html.
    ****************************************************************/    
    grunt.registerTask('dlsVersion', 'Make sure modules and html files are loaded by their updated version name', function() {
        //read version from package.json
        var pkgversion = JSON.parse(grunt.file.read('package.json')).version;
        var options = this.options();
        var srcArr = options.src;
        var htmlFile = grunt.file.read(options.index);
        
        //Loop over files specified in src
        grunt.file.expand(srcArr).forEach(function(src) {
            if (!grunt.file.exists(String(src))) {
                grunt.log.writeln('Cannot rename non-existent file.');
            } 
            // Do not version directories
            else if(!fs.statSync(String(src)).isDirectory()){
                var position = src.lastIndexOf(".");
                var dest = [src.slice(0, position), '-'+pkgversion, src.slice(position)].join('');
                grunt.log.writeln('Renaming File ' + src + ' -> ' + dest);

                //rename file to add version number
                fs.renameSync(String(src),String(dest),function (err) {
                    if (err) {
                        grunt.log.error();
                        grunt.verbose.error();
                        grunt.fail.warn('Rename operation failed.');
                    }
                });
            //Update file reference in index html.    
            htmlFile = htmlFile.replace(src.split('/').pop(),dest.split('/').pop());
            }
        });

        //Update requirejs versioned module names in optimized js files. 
        if(options.requireJs.updateRequireModules){
            //Read requireJs module names from requireJS task
            var requirejs = grunt.config("requirejs");
            var modules = Object.keys(requirejs);
            
            //Loop over requireJS modules
            for(var i=0;i<modules.length ;i++){
                var baseDir = requirejs[modules[i]].options.baseUrl;
                var moduleName = requirejs[modules[i]].options.name;
                var versionedModule = requirejs[modules[i]].options.out.replace('.js','') + '-' +pkgversion+'.js';
                var versionedModuleName = versionedModule.replace('.js', '').replace(baseDir,'');
                var versionedModuleFile = grunt.file.read(versionedModule);  
                
                //Update versioned file name in "define" block
                //Replace both single quoted and double quoted define blocks.
                versionedModuleFile = versionedModuleFile.replace("define\(\"" + moduleName + "\"", "define('" + versionedModuleName + "'");
                versionedModuleFile = versionedModuleFile.replace('define\(\'' + moduleName + "\'", "define('" + versionedModuleName + "'");
                
                //Loop over all modules to replace couch potato dependency of this module
                for(var j=0 ;j<modules.length ;j++){
                    var lazyBaseDir = requirejs[modules[j]].options.baseUrl;
                    var lazyModuleName = requirejs[modules[j]].options.name;
                    var lazyVersionedModule = requirejs[modules[i]].options.out.replace('.js','') + '-' +pkgversion+'.js';
                    var lazyVersionedModuleName = lazyVersionedModule.replace('.js', '').replace(lazyBaseDir,'');
                    
                     //Update versioned file name in "resolveDependencies" block                  
                    versionedModuleFile = versionedModuleFile.replace('couchPotatoProvider\.resolveDependencies\(\[\"' + requirejs[modules[j]].options.name ,'couchPotatoProvider.resolveDependencies(["' + lazyVersionedModuleName);    
                    grunt.file.write(versionedModule, versionedModuleFile);    
                }
                grunt.file.write(versionedModule, versionedModuleFile);
            }
        }
        
        //Update data-main to include versioned module(main)
        if(options.requireJs.datamain){
            var datamain = options.requireJs.datamain.replace('.js','');          
            htmlFile = htmlFile.replace('data-main=\"'+ datamain +'.js\"','data-main=\"' + datamain + '-' + pkgversion + '.js\"');
            htmlFile = htmlFile.replace('data-main=\''+ datamain +'.js\'','data-main=\"' + datamain + '-' + pkgversion + '.js\"');
        }
        
        //Update rconfigJs reference in index html
        if(options.requireJs.rconfigJs){
            var rconfig = options.requireJs.rconfigJs.replace('.js','');
            htmlFile = htmlFile.replace('src=\"' + rconfig + '.js\"','src=\"' + rconfig + '-' + pkgversion + '.js\"');
            htmlFile = htmlFile.replace('src=\'' + rconfig + '.js\'','src=\"' + rconfig + '-' + pkgversion + '.js\"');
        }
        grunt.file.write(options.index, htmlFile);    
    });

};