var require = {
    waitSeconds: 0,
    paths: {
        'jquery':'../../../../bower_components/jquery/dist/jquery.min',       
        'jquery-ui': '../../../../bower_components/jquery-ui/jquery-ui.min',        
        'bootstrap': '../../../../bower_components/bootstrap/dist/js/bootstrap.min',
        'angular': '../../../../bower_components/angular/angular.min',
        'angular-resource': '../../../../bower_components/angular-resource/angular-resource.min',
        'angular-animate': '../../../../bower_components/angular-animate/angular-animate.min',
        'domReady': '../../../../bower_components/requirejs-domready/domReady',
        'angular-ui-router': '../../../../bower_components/angular-ui-router/release/angular-ui-router.min',
        'angular-bootstrap': '../../../../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'angular-couch-potato': '../../../../bower_components/angular-couch-potato/dist/angular-couch-potato', 
        'fastclick': '../../../../bower_components/fastclick/lib/fastclick',
        'lodash': '../../../../bower_components/lodash/dist/lodash.min',
        'notification': '../../../../dist/js/notification/SmartNotification.min', 
         // app js file includes
        'appConfig': '../app.config',
        'modules-includes': 'includes'
    },
    shim: {
        'angular': {'exports': 'angular', deps: ['jquery']},
        'angular-animate': { deps: ['angular'] },
        'angular-resource': { deps: ['angular'] },
        'angular-bootstrap': { deps: ['angular'] },
        'angular-ui-router': { deps: ['angular'] },
        'angular-couch-potato': { deps: ['angular'] },
        'bootstrap':{deps: ['jquery']},
        'modules-includes': { deps: ['angular']},
        'jquery-ui': { deps: ['jquery']},
        'notification': { deps: ['jquery']},
    },
    priority: [
        'jquery',
        'bootstrap',
        'angular'
    ]
};