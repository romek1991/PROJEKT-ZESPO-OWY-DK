define(['./module'], function (controllers) {
    'use strict';

    controllers.controller('MenuCtrl', ['AuthenticationService', '$cookies', '$scope', '$state',
        function (AuthenticationService, $cookies, $scope, $state) {
        var mCtrl = this;

        if(!(typeof $cookies.get('token') === 'undefined')){
            AuthenticationService.setLoggedInFlag(true);
            AuthenticationService.setUser($cookies.get('user'));
        }



        $scope.$watch(function(){return AuthenticationService.getLoggedInFlag()},
            function(value){
                mCtrl.isLogged = value;
            }
        );


        mCtrl.logout = function () {
            AuthenticationService.setLoggedInFlag(false);
            if ($cookies.get('token')) {
                $cookies.remove('token');
                $cookies.remove('user');
                $state.go('index');
            }
        };


    }]);
});