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
    //This task updates versioned requirejs modules in their optimized file
    grunt.registerTask('updateVersions', 'Make sure modules and html files are loaded by their updated version name', function() {
        var pkgversion = JSON.parse(grunt.file.read('package.json')).version;
        var options = this.options();
        var srcArr = options.src;
        var htmlFile = grunt.file.read(options.index);
        grunt.file.expand(srcArr).forEach(function(src) {
            if (!grunt.file.exists(String(src))) {
                grunt.log.writeln('Cannot rename non-existent file.');
            } else if(!fs.statSync(String(src)).isDirectory()){
                var position = src.lastIndexOf(".");
                var dest = [src.slice(0, position), '-'+pkgversion, src.slice(position)].join('');
                grunt.log.writeln('Renaming File ' + src + ' -> ' + dest);

                fs.renameSync(String(src),String(dest),function (err) {
                    if (err) {
                        grunt.log.error();
                        grunt.verbose.error();
                        grunt.fail.warn('Rename operation failed.');
                    }
                });
            htmlFile = htmlFile.replace(src.split('/').pop(),dest.split('/').pop());
            }
        });

        if(options.requireJs.updateRequireModules){
            var requirejs = grunt.config("requirejs");
            var modules = Object.keys(requirejs);
            for(var i=0;i<modules.length ;i++){
                var baseDir = requirejs[modules[i]].options.baseUrl;
                var moduleName = requirejs[modules[i]].options.name;
                var versionedModule = requirejs[modules[i]].options.out.replace('.js','') + '-' +pkgversion+'.js';
                var versionedModuleName = versionedModule.replace('.js', '').replace(baseDir,'');
                var versionedModuleFile = grunt.file.read(versionedModule);
                versionedModuleFile = versionedModuleFile.replace('define\(\'' + moduleName +"\'","define('"+versionedModuleName+"'");
                for(var j=0 ;j<modules.length ;j++){
                    var lazyBaseDir = requirejs[modules[j]].options.baseUrl;
                    var lazyModuleName = requirejs[modules[j]].options.name;
                    var lazyVersionedModule = requirejs[modules[i]].options.out.replace('.js','') + '-' +pkgversion+'.js';
                    var lazyVersionedModuleName = lazyVersionedModule.replace('.js', '').replace(lazyBaseDir,'');
                    versionedModuleFile = versionedModuleFile.replace('couchPotatoProvider\.resolveDependencies\(\[\"' + requirejs[modules[j]].options.name ,'couchPotatoProvider.resolveDependencies(["' + lazyVersionedModuleName);    
                    grunt.file.write(versionedModule, versionedModuleFile);    
                }
                grunt.file.write(versionedModule, versionedModuleFile);
            }
        }
        
        if(options.requireJs.datamain){
            var datamain = options.requireJs.datamain;
            htmlFile = htmlFile.replace('data-main=\"'+ datamain +'\"','data-main=\"' + datamain + '-' + pkgversion + '\"');
        }
        if(options.requireJs.rconfigJs){
            var rconfig = options.requireJs.rconfigJs.replace('.js','');
            htmlFile = htmlFile.replace('src=\"' + rconfig + '.js\"','src=\"' + rconfig + '-' + pkgversion + '.js\"');
        }
        grunt.file.write(options.index, htmlFile);    
    });

};