define([
    'angular',
    'angular-couch-potato',
    'angular-ui-router'
], function (ng, couchPotato) {

    "use strict";

    var module = ng.module('app.auth', [
        'ui.router'
    ]);

    couchPotato.configureApp(module);


    module.config(function ($stateProvider, $couchPotatoProvider) {
        $stateProvider.state('realLogin', {
            url: '/real-login',

            views: {
                root: {
                    templateUrl: "app/auth/login/login.html",
                    controller: 'LoginCtrl',
                    resolve: {
                        deps: $couchPotatoProvider.resolveDependencies([
                            'auth/models/User',
                            'auth/login/LoginCtrl'
                        ])
                    }
                }
            },
            data: {
                title: 'Login',
                rootId: 'extra-page'
            }

        })

        .state('login', {
            url: '/login',
            views: {
                root: {
                    templateUrl: 'app/auth/views/login.html',
                    controller : 'LoginCtrl'
                }
            },
            data: {
                title: 'Login',
                htmlId: 'extr-page'
            }
        })

        .state('register', {
            url: '/register',
            views: {
                root: {
                    templateUrl: 'app/auth/views/register.html'
                }
            },
            data: {
                title: 'Register',
                htmlId: 'extr-page'
            },
            resolve: {
                deps: $couchPotatoProvider.resolveDependencies([
                    'modules/forms/directives/validate/smartValidateForm'
                ])
            }
        })

        .state('forgotPassword', {
            url: '/forgot-password',
            views: {
                root: {
                    templateUrl: 'app/auth/views/forgot-password.html'
                }
            },
            data: {
                title: 'Forgot Password',
                htmlId: 'extr-page'
            },
            resolve: {
                deps: $couchPotatoProvider.resolveDependencies([
                    'modules/forms/directives/validate/smartValidateForm'
                ])
            }
        })

        .state('lock', {
            url: '/lock',
            views: {
                root: {
                    templateUrl: 'app/auth/views/lock.html'
                }
            },
            data: {
                title: 'Locked Screen',
                htmlId: 'lock-page'
            }
        })


    });

    module.run(function($couchPotato){
        module.lazy = $couchPotato;
    });
    return module;
});