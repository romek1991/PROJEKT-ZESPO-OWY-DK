define(['app'], function (app) {
    'use strict';
    return app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'modules/user/login.html'
        });

        $routeProvider.when('/signup', {
            templateUrl: 'modules/user/signup.html'
        });

       $routeProvider.otherwise({
            redirectTo: 'index.html'

        });
    }]);
});

// todo : move to ui-router
// todo : controller as syntax
// todo : bowerrc path !