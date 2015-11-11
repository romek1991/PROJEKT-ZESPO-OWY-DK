define(['app'], function (app) {
    'use strict';
    return app.config(function($stateProvider) {
        $stateProvider
            .state('index', {
                url:"",
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .state('login',{
                url:'/login',
                templateUrl: 'modules/user/login.html'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'modules/user/signup.html',
                controller: 'RegisterController',
                controllerAs: 'vm'
            });
    });
});

// todo : move to ui-router
// todo : controller as syntax
// todo : bowerrc path !