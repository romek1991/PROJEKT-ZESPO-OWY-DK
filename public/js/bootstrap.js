define([
    'require',
    'angular',
    'app',
    '../modules/routes'
], function (require, ng, app) {
    'use strict';
    require(['domReady!'], function (document) {
        app.config(function ($httpProvider) {
            $httpProvider.interceptors.push('TokenInterceptor');
        });

        app.run(['AuthenticationService','$rootScope', '$cookies', '$state',
            function (AuthenticationService, $rootScope, $cookies, $state) {

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                var requireLogin = toState.data.requireLogin;
                $rootScope.$$childTail.mCtrl.searchString = ""
                //alert("state changed");
                console.log("require : " + requireLogin);
                console.log('toState :');
                console.log(toState);
                console.log('cookies.get(\'token\') :' + $cookies.get('token'));
                if (requireLogin && typeof $cookies.get('token') === 'undefined') {
                    event.preventDefault();
                    $state.transitionTo('index');
                    //if user is not logged in then redirect to

                }
            });
        }]);

        ng.bootstrap(document, ['app']);
    });
});