define(['layout/module','lodash'], function (module, _) {

    'use strict';

    module.registerDirective('dlsSkin', function () {
        return {                                 
            compile: function () {
                var skin = _.find(appConfig.skins, {name: appConfig.smartSkin});               
	            $("body").addClass(skin.name);		                 
            }
        }
    });
});
