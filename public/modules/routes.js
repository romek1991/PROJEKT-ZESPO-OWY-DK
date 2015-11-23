define(['app'], function (app) {
    'use strict';
    return app.config(function($stateProvider) {
        $stateProvider
            .state('index', {
                url:"",
                templateUrl: 'modules/welcome/welcome.html',
                data: {
                    requireLogin: false
                }
            })
            .state('login',{
                url:'/login',
                templateUrl: 'modules/user/login.html',
                controller: 'LoginController',
                controllerAs: 'vm',
                data: {
                    requireLogin: false
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'modules/user/signup.html',
                controller: 'RegisterController',
                controllerAs: 'vm',
                data: {
                    requireLogin: false
                }
            })
            .state('app', {
                url:"",
                controllerAs: 'vm',
                data: {
                    requireLogin: true
                }
            })
            .state('app.start', {
                url: '/start',
                templateUrl: '/modules/start/start.html',
                controller: 'StartController',
                contollerAs: 'vm'
            })
            .state('app.profile', {
                url: '/profile/:login',
                templateUrl: 'modules/user/profile.html',
                controller: 'ProfileController',
                controllerAs: 'vm'
            })
            .state('app.trip', {
                url: '/trip',
                templateUrl: 'modules/trip/trip.html',
                controller: 'TripController',
                controllerAs: 'vm'
            })
            .state('app.addtrip', {
                url: '/addtrip',
                templateUrl: 'modules/trip/addtrip.html',
                controller: 'TripController',
                controllerAs: 'vm'
            })
            .state('app.test', {
                url:"/appTest"
            });
        //stany ktore sa po zalogowaniu tworzymy na zasadzie app.NAZWASTANU - wtedy sa zagniezdzone i wszedzie obowiazuje requireLogin:true ze stanu app(on jest parentem)
    });
});