define(['./app'], function (app) {
    'use strict';
    return app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'js/partials/partial1.html',
            controller: 'MyCtrl1'
        });

        $routeProvider.when('/view2', {
            templateUrl: 'js/partials/partial2.html',
            controller: 'MyCtrl2'
        });

        $routeProvider.when('/index', {
            templateUrl: 'js/partials/index.html'
        });


        $routeProvider.when('/login', {
            templateUrl: 'js/partials/login.html'
        });

        $routeProvider.when('/signup', {
            templateUrl: 'js/partials/signup.html'
        });



       $routeProvider.otherwise({
            redirectTo: 'index.html'

        });
    }]);
});

// todo : move to ui-router
// todo : controller as syntax
// todo : bowerrc path !