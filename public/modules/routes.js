define(['app'], function (app) {
    'use strict';
    return app.config(function($stateProvider) {
        $stateProvider
            .state('index', {
                url:"/",
                data: {
                    requireLogin: true
                }
            })
            .state('login',{
                url:'/login',
                templateUrl: 'modules/user/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'modules/user/signup.html',
                controller: 'RegisterController',
                controllerAs: 'vm'
            })
            .state('app', {
                url:"/",
                data: {
                    requireLogin: true
                }
            })
    });
});

// todo : move to ui-router
// todo : controller as syntax
// todo : bowerrc path !