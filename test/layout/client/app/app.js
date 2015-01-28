'use strict';

/**
 * @ngdoc overview
 * @name app [microApp]
 * @description
 * # app [microApp]
 *
 * Main module of the application.
 */

define([
    'angular',
    'angular-couch-potato',
    'angular-ui-router',
    'angular-animate',
    'angular-bootstrap'
], function (ng, couchPotato) {

    var app = ng.module('app', [
        'scs.couch-potato',
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        // App        
        'app.layout',       
        'app.dashboard'       
    ]);

    couchPotato.configureApp(app);

    app.run(function ($couchPotato) {
        app.lazy = $couchPotato;
    });

    return app;
});
